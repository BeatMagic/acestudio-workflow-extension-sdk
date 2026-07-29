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
  it("runs activate and exits when it resolves", async () => {
    const ran: string[] = [];
    const { exitCode, host } = startRun(
      {
        manifest: ONE_SHOT,
        activate: async (ctx) => {
          const clips: ClipListResult = await ctx.client.clip.list({ trackIndex: 0 });
          ran.push(`activate:${clips.clipCount}`);
        },
      },
      { host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(0);
    expect(ran).toEqual(["activate:1"]);
    expect(host.invocations.map((invocation: InvokeParams) => invocation.path)).toEqual(["clip list"]);
  });

  it("runs deactivate before it exits", async () => {
    const order: string[] = [];
    const { exitCode } = startRun(
      {
        manifest: ONE_SHOT,
        activate: () => {
          order.push("activate");
        },
        deactivate: () => {
          order.push("deactivate");
        },
      },
      { host: GRANTING_HOST },
    );

    await expect(exitCode).resolves.toBe(0);
    expect(order).toEqual(["activate", "deactivate"]);
  });

  it("presents the manifest's capability request at the handshake", async () => {
    const { exitCode, host } = startRun({ manifest: ONE_SHOT, activate: () => undefined }, { host: GRANTING_HOST });

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
        activate: async (ctx) => {
          refusal = await ctx.client.clip.list({ trackIndex: 0 }).catch((error: unknown) => error);
        },
      },
      { host: { grantedTokens: [] } },
    );

    await expect(exitCode).resolves.toBe(0);
    expect(isCode(refusal, "CAPABILITY_DENIED")).toBe(true);
    expect(host.invocations).toEqual([]);
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

  it("keeps its exit when a deactivate fails after the window closed", async () => {
    const activated = signal();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { exitCode, host } = startRun(
      {
        manifest: PERSISTENT,
        activate: () => {
          activated.announce();
        },
        // Overran the grace window and *then* failed: by the time it rejects, the
        // run is already over. The late failure changes nothing about the ending —
        // and, because the grace race is still subscribed to it, disturbs nothing on
        // the way out either.
        deactivate: () =>
          new Promise<void>((_resolve, reject) => {
            setTimeout(() => {
              reject(new Error("flush timed out"));
            }, 40);
          }),
      },
      { host: GRANTING_HOST },
    );

    await activated.reached;
    host.notifyShutdown({ reason: "app quit", graceMs: 20 });
    await expect(exitCode).resolves.toBe(0);
    // Long enough for the late rejection to land, so this run would notice if it
    // took anything with it.
    await new Promise((resolve) => setTimeout(resolve, 60));
    warn.mockRestore();
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

  it("keeps the code an activate exited with, rather than a one-shot's own zero", async () => {
    const order: string[] = [];
    const { exitCode } = startRun(
      {
        manifest: ONE_SHOT,
        activate: (ctx) => {
          order.push("activate");
          // An activate that ends the run itself. A one-shot ends anyway when
          // activate resolves, so the two endings meet here — and the first one
          // through is the one that counts.
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
        activate: () => undefined,
        deactivate: () => {
          throw new Error("could not flush the cache");
        },
      },
      { host: GRANTING_HOST },
    );

    // The work is done; a wind-down that fails is worth a log line, not a
    // different ending.
    await expect(exitCode).resolves.toBe(0);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("deactivate failed: could not flush the cache"));
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
  it("refuses an environment with no session token", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { exitCode } = startRun({ manifest: ONE_SHOT, activate: () => undefined }, { env: {} });

    await expect(exitCode).resolves.toBe(2);
    expect(error).toHaveBeenCalledWith(expect.stringContaining(`no ${BRIDGE_TOKEN_ENV}`));
    error.mockRestore();
  });

  it("refuses an environment with no bridge endpoint, when it has no transport of its own", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const extension = defineExtension(
      { manifest: ONE_SHOT, activate: () => undefined },
      {
        env: { [BRIDGE_TOKEN_ENV]: AUTH_TOKEN },
        exit: () => undefined,
      },
    );

    await expect(extension.exitCode).resolves.toBe(2);
    expect(error).toHaveBeenCalledWith(expect.stringContaining(`no ${BRIDGE_SOCKET_ENV}`));
    error.mockRestore();
  });

  it("reports a refused handshake rather than running a handler", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const activate = vi.fn();
    const { exitCode } = startRun({ manifest: ONE_SHOT, activate }, { host: { authToken: "a-different-token" } });

    await expect(exitCode).resolves.toBe(2);
    expect(activate).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(expect.stringContaining("could not start"));
    error.mockRestore();
  });
});

describe("the spawn contract", () => {
  it("reads the two variables ACE Studio's process host sets, and nothing else", () => {
    // Literals on purpose: these are the contract with the host, and a rename here
    // is a rename there. Two variables is the whole of it — the process is told
    // where the bridge is and who it is, never what to do.
    expect(BRIDGE_SOCKET_ENV).toBe("ACE_EXTENSION_BRIDGE_SOCKET");
    expect(BRIDGE_TOKEN_ENV).toBe("ACE_EXTENSION_BRIDGE_TOKEN");
  });
});
