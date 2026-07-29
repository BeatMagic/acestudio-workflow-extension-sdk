/**
 * Starting a run that has taken the UI paved road, and tearing it down again.
 *
 * Every UI test starts from the same state — a persistent extension whose page is
 * served and announced — and the differences between them are which declaration it
 * took to get there. That state is assembled here so the tests can be about assets,
 * bytes, or the dev server rather than about staging.
 *
 * Nothing here stands in for the layer under test: the run is a real
 * `defineExtension` against the scripted host peer, and the page side the tests use
 * is the shipped `./page` entry.
 */

import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect } from "vitest";
import type { ExtensionContext, UiProtocol } from "@timedomain/acestudio-extension-sdk";
import { connectChannel, type PageChannel } from "@timedomain/acestudio-extension-sdk/page";
import { BRIDGE_TOKEN_ENV } from "../../src/spawn-env.js";
import { AUTH_TOKEN, signal, startRun, type Run } from "./extension-run.js";
import { SurfaceWindow } from "./surface-window.js";

/** The token every verb on the surface channel rides. */
export const SURFACE_TOKEN = "workflow.ui";

/** The whole of the hello-world page the harness serves. */
export const HELLO = "<!doctype html><title>Stem Tools</title><h1>hello world</h1>";

/** A manifest that asks for the surface channel and nothing else. */
export const manifest = {
  id: "acme.stem-tools",
  name: "Stem Tools",
  version: "1.0.0",
  publisher: "Acme Audio",
  lifecycle: "persistent",
  capabilities: [SURFACE_TOKEN],
  entry: "dist/index.js",
} as const;

/** The manifest's type, for the contexts and runs a test names. */
export type StemManifest = typeof manifest;

/** A directory holding one hello-world page. */
export async function helloWorldAssets(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "ace-ui-"));
  await writeFile(join(dir, "index.html"), HELLO, "utf8");
  return dir;
}

/** What a test varies about the run it starts. */
export interface ServedOptions {
  /** The Studio side to script. A fresh one is used when the test does not need it. */
  window?: SurfaceWindow;
  /** What the host grants. The surface token by default, since the page needs it. */
  grantedTokens?: readonly string[];
  /** Spawn variables to set beside the harness's auth token. */
  env?: Record<string, string | undefined>;
  /** The paved-road declaration. `assets` defaults to a fresh hello-world directory. */
  ui?: { assets?: string; devServerUrl?: string };
  /** Turn SDK debug logging on by option. */
  debug?: boolean;
}

/** A started run whose page is served and announced. */
export interface Served {
  readonly run: Run<StemManifest>;
  readonly window: SurfaceWindow;
  readonly context: ExtensionContext<StemManifest>;
  /** The URL announced to ACE Studio — the loopback page, or the dev server. */
  readonly url: string;
  /** The assets directory the run was pointed at, served or not. */
  readonly assets: string;
}

/** A run and page channel bookkeeper, torn down whichever way a test ends. */
export interface UiHarness {
  /** Start a persistent run on the paved road, and wait until its page is announced. */
  startServed(options?: ServedOptions): Promise<Served>;
  /** Start a run that declared no `ui` at all — the `announceSurface` path. */
  startBare(options?: Omit<ServedOptions, "ui">): Promise<{
    run: Run<StemManifest>;
    window: SurfaceWindow;
    context: ExtensionContext<StemManifest>;
  }>;
  /** A page channel pointed at a served URL. */
  openPage<P extends UiProtocol>(url: string): PageChannel<P>;
  /** Something to undo when the test ends, in reverse order. */
  track(close: () => void | Promise<void>): void;
  teardown(): Promise<void>;
}

export function uiHarness(): UiHarness {
  const opened: Array<() => void | Promise<void>> = [];
  const track = (close: () => void | Promise<void>) => {
    opened.push(close);
  };

  const start = (options: ServedOptions, ui: { assets: string; devServerUrl?: string } | undefined) => {
    const window = options.window ?? new SurfaceWindow();
    const activated = signal<ExtensionContext<StemManifest>>();
    const run = startRun(
      {
        manifest,
        ...(ui === undefined ? {} : { ui }),
        activate: (context) => activated.announce(context),
      },
      {
        host: { grantedTokens: options.grantedTokens ?? [SURFACE_TOKEN], methods: window.methods() },
        env: { [BRIDGE_TOKEN_ENV]: AUTH_TOKEN, ...options.env },
        ...(options.debug === undefined ? {} : { debug: options.debug }),
      },
    );
    track(async () => {
      run.host.close();
      // Waited for, not just claimed: the run's wind-down closes its server and says so,
      // and a test that has stopped watching stderr should not still be producing lines
      // on it. Torn down mid-flight is a normal ending here, so the code is not checked.
      await run.extension.exitCode.catch(() => undefined);
    });
    return { run, window, activated };
  };

  return {
    track,
    teardown: async () => {
      for (const close of opened.reverse()) {
        await close();
      }
      opened.length = 0;
    },
    startServed: async (options: ServedOptions = {}) => {
      const assets = options.ui?.assets ?? (await helloWorldAssets());
      const { run, window, activated } = start(options, {
        assets,
        ...(options.ui?.devServerUrl === undefined ? {} : { devServerUrl: options.ui.devServerUrl }),
      });
      const context = await activated.reached;
      const url = context.ui.url;
      expect(url).toBeTypeOf("string");
      return { run, window, context, url: url as string, assets };
    },
    startBare: async (options: Omit<ServedOptions, "ui"> = {}) => {
      const { run, window, activated } = start(options, undefined);
      return { run, window, context: await activated.reached };
    },
    openPage: <P extends UiProtocol>(url: string) => {
      const channel = connectChannel<P>({ url });
      track(() => {
        channel.close();
      });
      return channel;
    },
  };
}

/** Wait for `check` to hold, so a test can observe a push without sleeping on a guess. */
export async function eventually(check: () => boolean): Promise<void> {
  await expect.poll(check, { timeout: 2_000, interval: 10 }).toBe(true);
}
