/**
 * The lifecycle choreography, driven end to end over an in-memory transport
 * against the scripted host peer: what a one-shot run does, what a persistent peer
 * does, and how each of them ends.
 */

import { describe, expect, it, vi } from "vitest";
import { isCode, type ClipListResult, type InvokeParams } from "@timedomain/acestudio-bridge-core";
import {
  BRIDGE_SOCKET_ENV,
  BRIDGE_TOKEN_ENV,
  COMMAND_ENV,
  defineExtension,
  type ExtensionManifest,
} from "@timedomain/acestudio-extension-sdk";
import { AUTH_TOKEN, signal, startRun } from "./support/extension-run.js";

/** A one-shot workflow asking for one capability, the way a scaffolded manifest reads. */
const ONE_SHOT = {
  id: "acme.stem-tools",
  name: "Stem Tools",
  version: "1.2.0",
  publisher: "Acme Audio",
  lifecycle: "one-shot",
  capabilities: ["clip.read"],
  entry: "dist/index.js",
} as const satisfies ExtensionManifest;

/** The same extension, as a long-lived peer. */
const PERSISTENT = { ...ONE_SHOT, lifecycle: "persistent" } as const satisfies ExtensionManifest;

/** A host that grants what the manifests ask for and answers the one operation they call. */
const GRANTING_HOST = {
  grantedTokens: ["clip.read"],
  operations: {
    "clip list": { data: { clipCount: 1, clips: [] } },
  },
} as const;

describe("a one-shot run", () => {
  it("dispatches the invoked command and exits when it resolves", async () => {
    const ran: string[] = [];
    const { exitCode, host } = startRun(
      {
        manifest: ONE_SHOT,
        commands: {
          "render-stems": async (ctx) => {
            const clips: ClipListResult = await ctx.client.clip.list({ trackIndex: 0 });
            ran.push(`render-stems:${clips.clipCount}:${ctx.command}`);
          },
        },
      },
      { command: "render-stems", host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(0);
    expect(ran).toEqual(["render-stems:1:render-stems"]);
    expect(host.invocations.map((invocation: InvokeParams) => invocation.path)).toEqual(["clip list"]);
  });

  it("runs deactivate before it exits", async () => {
    const order: string[] = [];
    const { exitCode } = startRun(
      {
        manifest: ONE_SHOT,
        commands: {
          "render-stems": () => {
            order.push("command");
          },
        },
        deactivate: () => {
          order.push("deactivate");
        },
      },
      { command: "render-stems", host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(0);
    expect(order).toEqual(["command", "deactivate"]);
  });

  it("presents the manifest's capability request at the handshake", async () => {
    const { exitCode, host } = startRun(
      { manifest: ONE_SHOT, commands: { "render-stems": () => undefined } },
      { command: "render-stems", host: GRANTING_HOST },
    );

    await expect(host.handshake).resolves.toMatchObject({
      authToken: AUTH_TOKEN,
      requestedCapabilities: ["clip.read"],
    });
    await expect(exitCode).resolves.toBe(0);
  });

  it("hands the handler a client that is still the guarded one", async () => {
    // The manifest asks for `clip.read`, the host grants nothing, and the call is
    // refused locally rather than on the wire — the narrowing is a view of the same
    // guarded client, not a second gate that could disagree with it.
    let refusal: unknown;
    const { exitCode, host } = startRun(
      {
        manifest: ONE_SHOT,
        commands: {
          "render-stems": async (ctx) => {
            refusal = await ctx.client.clip.list({ trackIndex: 0 }).catch((error: unknown) => error);
          },
        },
      },
      { command: "render-stems", host: { grantedTokens: [] } },
    );

    await expect(exitCode).resolves.toBe(0);
    expect(isCode(refusal, "CAPABILITY_DENIED")).toBe(true);
    expect(host.invocations).toEqual([]);
  });

  it("runs activate first when one is declared, then the command", async () => {
    const order: string[] = [];
    const { exitCode } = startRun(
      {
        manifest: ONE_SHOT,
        activate: () => {
          order.push("activate");
        },
        commands: {
          "render-stems": () => {
            order.push("command");
          },
        },
      },
      { command: "render-stems", host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(0);
    expect(order).toEqual(["activate", "command"]);
  });

  it("runs activate alone when the host named no command", async () => {
    const order: string[] = [];
    const { exitCode } = startRun(
      {
        manifest: ONE_SHOT,
        activate: () => {
          order.push("activate");
        },
      },
      { host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(0);
    expect(order).toEqual(["activate"]);
  });
});

describe("a persistent peer", () => {
  it("runs activate and stays up", async () => {
    const activated = signal();
    const ended = vi.fn();
    const { exitCode } = startRun(
      {
        manifest: PERSISTENT,
        activate: () => {
          activated.announce();
        },
      },
      { host: GRANTING_HOST },
    );
    void exitCode.then(ended);

    await activated.reached;
    // A microtask turn after activate resolved: the run has had its chance to end
    // and did not, which is the whole difference from a one-shot.
    await Promise.resolve();
    expect(ended).not.toHaveBeenCalled();
  });

  it("winds down through deactivate when ACE Studio stops it", async () => {
    const activated = signal();
    const order: string[] = [];
    const { exitCode, host } = startRun(
      {
        manifest: PERSISTENT,
        activate: () => {
          order.push("activate");
          activated.announce();
        },
        deactivate: () => {
          order.push("deactivate");
        },
      },
      { host: GRANTING_HOST },
    );

    await activated.reached;
    host.notifyShutdown({ reason: "user stopped the workflow", graceMs: 5_000 });

    await expect(exitCode).resolves.toBe(0);
    expect(order).toEqual(["activate", "deactivate"]);
  });

  it("exits inside the grace window even when deactivate never finishes", async () => {
    const activated = signal();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { exitCode, host } = startRun(
      {
        manifest: PERSISTENT,
        activate: () => {
          activated.announce();
        },
        // The wedged case ACE Studio's hard kill exists for: the SDK's job is to be
        // gone before that kill lands.
        deactivate: () => new Promise<void>(() => undefined),
      },
      { host: GRANTING_HOST },
    );

    await activated.reached;
    host.notifyShutdown({ reason: "app quit", graceMs: 20 });

    await expect(exitCode).resolves.toBe(0);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("did not finish inside the 20ms shutdown grace"));
    warn.mockRestore();
  });

  it("dispatches the command it was invoked for and keeps running", async () => {
    const order: string[] = [];
    const dispatched = signal();
    const ended = vi.fn();
    const { exitCode } = startRun(
      {
        manifest: PERSISTENT,
        activate: () => {
          order.push("activate");
        },
        commands: {
          "open-panel": () => {
            order.push("open-panel");
            dispatched.announce();
          },
        },
      },
      { command: "open-panel", host: GRANTING_HOST },
    );
    void exitCode.then(ended);

    await dispatched.reached;
    await Promise.resolve();
    expect(order).toEqual(["activate", "open-panel"]);
    expect(ended).not.toHaveBeenCalled();
  });
});

describe("ending a run", () => {
  it("exits with the code ctx.exit asked for, after deactivate", async () => {
    const order: string[] = [];
    const { exitCode } = startRun(
      {
        manifest: PERSISTENT,
        activate: (ctx) => {
          order.push("activate");
          ctx.exit(7);
        },
        deactivate: () => {
          order.push("deactivate");
        },
      },
      { host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(7);
    expect(order).toEqual(["activate", "deactivate"]);
  });

  it("exits with the code it meant to even when deactivate throws", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { exitCode } = startRun(
      {
        manifest: ONE_SHOT,
        commands: { "render-stems": () => undefined },
        deactivate: () => {
          throw new Error("could not flush the cache");
        },
      },
      { command: "render-stems", host: GRANTING_HOST },
    );

    // The work is done; a wind-down that fails is worth a log line, not a
    // different ending.
    await expect(exitCode).resolves.toBe(0);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("deactivate failed: could not flush the cache"));
    error.mockRestore();
  });

  it("reports a failed command as exit 1, and still winds down", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const order: string[] = [];
    const { exitCode } = startRun(
      {
        manifest: ONE_SHOT,
        commands: {
          "render-stems": () => {
            throw new Error("the render died");
          },
        },
        deactivate: () => {
          order.push("deactivate");
        },
      },
      { command: "render-stems", host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(1);
    expect(order).toEqual(["deactivate"]);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("a command failed: the render died"));
    error.mockRestore();
  });

  it("skips deactivate when activate is what failed", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const deactivate = vi.fn();
    const { exitCode } = startRun(
      {
        manifest: PERSISTENT,
        activate: () => {
          throw new Error("could not reach the model server");
        },
        deactivate,
      },
      { host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(1);
    expect(deactivate).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(expect.stringContaining("activate failed: could not reach the model server"));
    error.mockRestore();
  });

  it("exits 3 without a wind-down when the bridge drops", async () => {
    const activated = signal();
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const deactivate = vi.fn();
    const { exitCode, host } = startRun(
      {
        manifest: PERSISTENT,
        activate: () => {
          activated.announce();
        },
        deactivate,
      },
      { host: GRANTING_HOST },
    );

    await activated.reached;
    host.close();

    await expect(exitCode).resolves.toBe(3);
    expect(deactivate).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(expect.stringContaining("the bridge connection to ACE Studio closed"));
    error.mockRestore();
  });
});

describe("a run that cannot start", () => {
  it("refuses a command it does not implement, naming the ones it does", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { exitCode, host } = startRun(
      { manifest: ONE_SHOT, commands: { "render-stems": () => undefined } },
      { command: "render-stemz", host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(2);
    // Refused before the handshake: an extension invoked for a command it cannot
    // run has no business holding a session.
    expect(host.invocations).toEqual([]);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("invoked the command 'render-stemz', which this extension does not implement"),
    );
    expect(error).toHaveBeenCalledWith(expect.stringContaining("it implements render-stems"));
    error.mockRestore();
  });

  it("refuses a run with neither a command nor an activate", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { exitCode } = startRun({ manifest: ONE_SHOT, commands: { "render-stems": () => undefined } }, {
      host: GRANTING_HOST,
    });

    await expect(exitCode).resolves.toBe(2);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("no command to dispatch and the extension declares no activate"),
    );
    error.mockRestore();
  });

  it("refuses an environment with no session token", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { exitCode } = startRun(
      { manifest: ONE_SHOT, commands: { "render-stems": () => undefined } },
      { env: { [COMMAND_ENV]: "render-stems" } },
    );

    await expect(exitCode).resolves.toBe(2);
    expect(error).toHaveBeenCalledWith(expect.stringContaining(`no ${BRIDGE_TOKEN_ENV}`));
    error.mockRestore();
  });

  it("refuses an environment with no bridge endpoint, when it has no transport of its own", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const extension = defineExtension(
      { manifest: ONE_SHOT, commands: { "render-stems": () => undefined } },
      {
        env: { [BRIDGE_TOKEN_ENV]: AUTH_TOKEN, [COMMAND_ENV]: "render-stems" },
        exit: () => undefined,
      },
    );

    await expect(extension.exitCode).resolves.toBe(2);
    expect(error).toHaveBeenCalledWith(expect.stringContaining(`no ${BRIDGE_SOCKET_ENV}`));
    error.mockRestore();
  });

  it("reports a refused handshake rather than running a handler", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const command = vi.fn();
    const { exitCode } = startRun(
      { manifest: ONE_SHOT, commands: { "render-stems": command } },
      { command: "render-stems", host: { authToken: "a-different-token" } },
    );

    await expect(exitCode).resolves.toBe(2);
    expect(command).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(expect.stringContaining("could not start"));
    error.mockRestore();
  });
});

describe("the spawn contract", () => {
  it("is the variable names ACE Studio's process host sets", () => {
    // Literals on purpose: these three names are the contract with the host, and a
    // rename here is a rename there.
    expect(BRIDGE_SOCKET_ENV).toBe("ACE_EXTENSION_BRIDGE_SOCKET");
    expect(BRIDGE_TOKEN_ENV).toBe("ACE_EXTENSION_BRIDGE_TOKEN");
    expect(COMMAND_ENV).toBe("ACE_EXTENSION_COMMAND");
  });
});
