/**
 * The move exchange at the `defineExtension` seam: the quiesce the host blocks on,
 * and the announcement that releases it.
 *
 * Driven through the same harness as the rest of the lifecycle, because what is
 * worth asserting is what the *host* observes. Core already covers what its own
 * `onPrepareMove` option does, and an extension author never reaches that option —
 * the gap this closes was that nothing connected the two.
 */

import { describe, expect, it, vi } from "vitest";
import { type ExtensionManifest } from "@timedomain/acestudio-workflow-extension-sdk";
import { signal, startRun } from "./support/extension-run.js";

/** A peer that stays up to be asked, holding the token the exchange is gated on. */
const MOVER = {
  id: "acme.stem-tools",
  name: "Stem Tools",
  version: "1.2.0",
  publisher: "Acme Audio",
  lifecycle: "persistent",
  capabilities: ["session.move"],
  entry: "dist/index.js",
} as const satisfies ExtensionManifest;

/** A host that grants the token, so the peer is one the exchange reaches. */
const MOVE_HOST = { grantedTokens: ["session.move"] } as const;

describe("the pre-move quiesce", () => {
  it("runs the author's hook before the host is told the folder is free", async () => {
    const order: string[] = [];
    const activated = signal();
    const { host } = startRun(
      {
        manifest: MOVER,
        activate: () => {
          activated.announce();
        },
        quiesce: async () => {
          order.push("quiesce:start");
          await Promise.resolve();
          order.push("quiesce:done");
        },
      },
      { host: MOVE_HOST },
    );
    await activated.reached;

    await expect(host.prepareMove()).resolves.toEqual({ ready: true });
    // The ack arriving only after both lines is the whole contract: the host copies
    // the folder next, and may do that only once the hook has finished releasing it.
    expect(order).toEqual(["quiesce:start", "quiesce:done"]);
  });

  it("faults the call when the hook throws, rather than claiming the folder is free", async () => {
    const activated = signal();
    const { host } = startRun(
      {
        manifest: MOVER,
        activate: () => {
          activated.announce();
        },
        quiesce: () => {
          throw new Error("the render is still writing stems");
        },
      },
      { host: MOVE_HOST },
    );
    await activated.reached;

    // Not `{ ready: false }`. A hook that throws says the extension is in a state it
    // cannot quiesce from, and the host reads a fault as unsafe to copy — the same
    // outcome, reached without offering a refusal the peer is not entitled to.
    const fault = await host.prepareMove().then(
      () => undefined,
      (error: unknown) => error,
    );
    expect(fault).toMatchObject({ message: expect.stringContaining("the render is still writing stems") });
  });
});

describe("the release", () => {
  it("hands the author where the project folder went", async () => {
    const activated = signal();
    const resumed = signal<string>();
    const { host } = startRun(
      {
        manifest: MOVER,
        activate: () => {
          activated.announce();
        },
        quiesce: () => undefined,
        resume: (_ctx, relocation) => {
          resumed.announce(relocation.projectFolder);
        },
      },
      { host: MOVE_HOST },
    );
    await activated.reached;
    await host.prepareMove();

    host.relocateProject({ projectFolder: "/Users/someone/Music/Moved.acep" });

    await expect(resumed.reached).resolves.toBe("/Users/someone/Music/Moved.acep");
  });

  it("runs on an abandoned move too, where the folder is the one it already had", async () => {
    const activated = signal();
    const resumed = signal<string>();
    const { host } = startRun(
      {
        manifest: MOVER,
        activate: () => {
          activated.announce();
        },
        quiesce: () => undefined,
        resume: (_ctx, relocation) => {
          resumed.announce(relocation.projectFolder);
        },
      },
      { host: MOVE_HOST },
    );
    await activated.reached;
    await host.prepareMove();

    // The save failed and the project stayed put. The peer is still parked, so it is
    // still owed the announcement — an unchanged path is what says "carry on".
    host.relocateProject({ projectFolder: "/Users/someone/Music/Original.acep" });

    await expect(resumed.reached).resolves.toBe("/Users/someone/Music/Original.acep");
  });

  it("keeps the run alive across the exchange", async () => {
    const activated = signal();
    const resumed = signal<string>();
    const { host, exitCode } = startRun(
      {
        manifest: MOVER,
        activate: () => {
          activated.announce();
        },
        quiesce: () => undefined,
        resume: (_ctx, relocation) => {
          resumed.announce(relocation.projectFolder);
        },
      },
      { host: MOVE_HOST },
    );
    await activated.reached;
    await host.prepareMove();
    host.relocateProject({ projectFolder: "/Users/someone/Music/Moved.acep" });
    await resumed.reached;

    // A move is not an ending: the peer parked and came back, and ACE Studio still
    // has the extension it spawned. Stopping it is what ends the run.
    host.notifyShutdown({ reason: "user stopped the workflow", graceMs: 5_000 });
    await expect(exitCode).resolves.toBe(0);
  });
});

describe("the manifest and the hook have to agree", () => {
  it("refuses to start when the token is requested with no quiesce", async () => {
    // Asserted on the message as well as the code, because `2` is every way a run
    // never started — a bad spawn environment reaches it too.
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { exitCode } = startRun(
      // The shape the gate exists for: core acks `ready: true` for a peer with no
      // hook, so this extension would tell ACE Studio it had stopped writing without
      // its author ever being asked to stop.
      { manifest: MOVER, activate: () => undefined },
      { host: MOVE_HOST },
    );

    await expect(exitCode).resolves.toBe(2);
    expect(logged.mock.calls.flat().join("\n")).toContain("requests `session.move` but declares no `quiesce`");
    logged.mockRestore();
  });

  it("refuses to start when a quiesce is declared without the token", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { exitCode } = startRun(
      {
        manifest: { ...MOVER, capabilities: [] } as const satisfies ExtensionManifest,
        activate: () => undefined,
        quiesce: () => undefined,
      },
      { host: { grantedTokens: [] } },
    );

    // A peer without the token is never asked, so the hook could never run — the
    // manifest is missing the token the author thought they had.
    await expect(exitCode).resolves.toBe(2);
    expect(logged.mock.calls.flat().join("\n")).toContain("declares `quiesce` but does not request `session.move`");
    logged.mockRestore();
  });

  it("refuses to start when a resume is declared without the token", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { exitCode } = startRun(
      {
        manifest: { ...MOVER, capabilities: [] } as const satisfies ExtensionManifest,
        activate: () => undefined,
        resume: () => undefined,
      },
      { host: { grantedTokens: [] } },
    );

    // The token gates the announcement as well as the quiesce, so this hook is as
    // unreachable as an orphaned `quiesce` — the same missing manifest entry.
    await expect(exitCode).resolves.toBe(2);
    expect(logged.mock.calls.flat().join("\n")).toContain("declares `resume` but does not request `session.move`");
    logged.mockRestore();
  });

  it("starts an extension that holds the token with a quiesce but no resume", async () => {
    // `resume` stays optional: an extension that reopens nothing has nothing to do
    // when the move ends.
    const activated = signal();
    const { host, exitCode } = startRun(
      {
        manifest: MOVER,
        activate: () => {
          activated.announce();
        },
        quiesce: () => undefined,
      },
      { host: MOVE_HOST },
    );
    await activated.reached;
    await expect(host.prepareMove()).resolves.toEqual({ ready: true });

    host.notifyShutdown({ reason: "user stopped the workflow", graceMs: 5_000 });
    await expect(exitCode).resolves.toBe(0);
  });

  it("starts an extension that neither requests the token nor declares a hook", async () => {
    const { exitCode } = startRun(
      {
        manifest: { ...MOVER, lifecycle: "one-shot", capabilities: [] } as const satisfies ExtensionManifest,
        activate: () => undefined,
      },
      { host: { grantedTokens: [] } },
    );

    await expect(exitCode).resolves.toBe(0);
  });
});
