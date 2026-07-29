/**
 * Debug mode: what the SDK writes about itself, where it writes it, and what it must
 * never write.
 *
 * The last of those is the one worth a test. There is no wire trace here on purpose
 * (ADR 0091 §6), so a debug line naming an operation is right and a debug line
 * carrying an argument, a result, or the session token is a leak — which is asserted
 * against real values planted in a real call rather than trusted to a code reading.
 */

import { afterEach, expect, test, vi } from "vitest";
import { createDebugLog, type ClipListResult } from "@timedomain/acestudio-bridge-core";
import type { ExtensionManifest } from "@timedomain/acestudio-extension-sdk";
import { DEBUG_ENV, BRIDGE_TOKEN_ENV } from "../src/spawn-env.js";
import { AUTH_TOKEN, startRun } from "./support/extension-run.js";
import { uiHarness } from "./support/served-ui.js";

const ui = uiHarness();
afterEach(ui.teardown);

/** A value planted in a call's parameters, distinctive enough to find in a log. */
const PARAM_MARKER = 314159;

/** A value planted in the host's answer, for the same reason. */
const RESULT_MARKER = "an-arrangement-the-user-has-not-published";

const ONE_SHOT = {
  id: "acme.stem-tools",
  name: "Stem Tools",
  version: "1.0.0",
  publisher: "Acme Audio",
  lifecycle: "one-shot",
  capabilities: ["clip.read"],
  entry: "dist/index.js",
} as const satisfies ExtensionManifest;

/** A host that grants what the manifest asks and answers with the planted marker. */
const GRANTING_HOST = {
  grantedTokens: ["clip.read"],
  operations: { "clip list": { data: { clipCount: 1, clips: [{ name: RESULT_MARKER }] } } },
} as const;

/** Everything written to stderr while a test runs, and how to stop capturing. */
function captureStderr(): { written: string[]; release(): string } {
  const written: string[] = [];
  const spy = vi.spyOn(process.stderr, "write").mockImplementation(((chunk: string | Uint8Array) => {
    written.push(typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk));
    return true;
  }) as typeof process.stderr.write);
  return {
    written,
    release: () => {
      spy.mockRestore();
      return written.join("");
    },
  };
}

/** Run a one-shot that makes one operation call, and return everything stderr saw. */
async function runWithOneCall(options: { debug?: boolean; env?: Record<string, string> }): Promise<string> {
  const stderr = captureStderr();
  try {
    const { exitCode } = startRun(
      {
        manifest: ONE_SHOT,
        activate: async (ctx) => {
          const clips: ClipListResult = await ctx.client.clip.list({ trackIndex: PARAM_MARKER });
          expect(clips.clipCount).toBe(1);
        },
        // Declared so the wind-down is part of what this run has to report on.
        deactivate: () => undefined,
      },
      {
        host: GRANTING_HOST,
        env: { [BRIDGE_TOKEN_ENV]: AUTH_TOKEN, ...options.env },
        ...(options.debug === undefined ? {} : { debug: options.debug }),
      },
    );
    await expect(exitCode).resolves.toBe(0);
  } finally {
    stderr.release();
  }
  return stderr.written.join("");
}

test("with debug on, the SDK says what it did — the handshake, the call, the lifecycle", async () => {
  const log = await runWithOneCall({ debug: true });

  expect(log).toContain("[ace-sdk] handshake:");
  expect(log).toContain("clip.read");
  expect(log).toContain("call clip list");
  expect(log).toContain("call clip list: answered");
  expect(log).toContain("lifecycle: activate");
  expect(log).toContain("lifecycle: deactivate");
  expect(log).toContain("lifecycle: exiting with 0");
  // Every line is labelled, so a reader can tell them from the extension's own output.
  for (const line of log.split("\n").filter((text) => text.length > 0)) {
    expect(line.startsWith("[ace-sdk] ")).toBe(true);
  }
});

test("no argument, no result, and no session token reaches the log", async () => {
  const log = await runWithOneCall({ debug: true });

  expect(log).not.toContain(String(PARAM_MARKER));
  expect(log).not.toContain(RESULT_MARKER);
  expect(log).not.toContain(AUTH_TOKEN);
});

test("with debug off — which is the default — the SDK says nothing", async () => {
  expect(await runWithOneCall({})).toBe("");
});

test("the environment variable the dev tooling sets turns it on, with no option passed", async () => {
  const log = await runWithOneCall({ env: { [DEBUG_ENV]: "1" } });

  expect(log).toContain("call clip list");
});

test("a variable set to off is off, so a host can spell either", async () => {
  expect(await runWithOneCall({ env: { [DEBUG_ENV]: "0" } })).toBe("");
});

test("the option decides over the environment", async () => {
  expect(await runWithOneCall({ debug: false, env: { [DEBUG_ENV]: "1" } })).toBe("");
});

test("a refusal is named by its code, not by the message it would carry", async () => {
  const stderr = captureStderr();
  const { exitCode } = startRun(
    {
      // The manifest asks for `clip.read` and the host grants nothing, so the call is
      // refused before it reaches the wire.
      manifest: ONE_SHOT,
      activate: async (ctx) => {
        await ctx.client.clip.list({ trackIndex: PARAM_MARKER }).catch(() => undefined);
      },
    },
    { host: { grantedTokens: [] }, debug: true },
  );
  await expect(exitCode).resolves.toBe(0);
  const log = stderr.release();

  expect(log).toContain("call clip list: refused before the wire, CAPABILITY_DENIED");
});

test("the channel and the assets it serves are named too, without their contents", async () => {
  const stderr = captureStderr();
  let log = "";
  try {
    const { context, url, run } = await ui.startServed({ debug: true });
    const channel = context.ui.channel<{ calls: { ping(): string }; events: Record<never, never> }>();
    channel.handle("ping", () => "pong");
    const handle = context.ui.serveAsset(new TextEncoder().encode("audio bytes"), { contentType: "audio/wav" });

    const page = ui.openPage<{ calls: { ping(): string } }>(url);
    await expect(page.call("ping")).resolves.toBe("pong");
    expect((await fetch(handle.url)).status).toBe(200);
    // Ended the way a run normally ends, while the capture is still up: that path waits
    // for the server to stop before it settles, so every wind-down line lands in the log
    // this test reads instead of on the runner's stderr afterwards. Dropping the bridge
    // instead would not — it stops the server without waiting, deliberately.
    context.exit();
    await expect(run.extension.exitCode).resolves.toBe(0);
  } finally {
    log = stderr.release();
  }

  expect(log).toContain("ui: serving the page at");
  expect(log).toContain("ui call ping");
  expect(log).toContain("surface: announced");
  expect(log).toContain("asset: serving 11 bytes");
  expect(log).toContain("ui: stopped serving");
  // The URL's token is what guards the bytes, so it is not something to write down.
  expect(log).not.toContain("audio bytes");
});

test("`createDebugLog` writes nothing at all when it is off", () => {
  const stderr = captureStderr();
  createDebugLog(false)("this line does not exist");
  createDebugLog(true)("this one does");

  expect(stderr.release()).toBe("[ace-sdk] this one does\n");
});
