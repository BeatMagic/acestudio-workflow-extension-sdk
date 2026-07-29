/**
 * The UI paved road, driven end to end: a real loopback server, the real page-side
 * module fetching from it, and the real announcement going over the bridge to a
 * scripted Studio.
 *
 * Nothing here mocks the layer under test. The page side is the shipped `./page`
 * entry rather than a stand-in for it, because "the two ends of one protocol type
 * actually talk to each other" is the whole claim — a fake on either end would prove
 * only that the fake matched.
 */

import { chmod, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test, vi } from "vitest";
import { isCode } from "@timedomain/acestudio-bridge-core";
import { connectChannel } from "@timedomain/acestudio-extension-sdk/page";
import type { ExtensionContext, UiProtocol } from "@timedomain/acestudio-extension-sdk";
import { WORKFLOWUI_METHOD_CAPABILITIES } from "../src/generated/WorkflowUi.acerpc.js";
import { signal, startRun, type Run } from "./support/extension-run.js";
import { SURFACE_METHODS, SurfaceWindow } from "./support/surface-window.js";

/** The token every verb on the surface channel rides. */
const SURFACE_TOKEN = "workflow.ui";

const HELLO = "<!doctype html><title>Stem Tools</title><h1>hello world</h1>";

/** A manifest that asks for the surface channel and nothing else. */
const manifest = {
  id: "acme.stem-tools",
  name: "Stem Tools",
  version: "1.0.0",
  publisher: "Acme Audio",
  lifecycle: "persistent",
  capabilities: [SURFACE_TOKEN],
  entry: "dist/index.js",
} as const;

/** The protocol both ends of the channel import — one `call` and one `event`. */
interface StemsUi extends UiProtocol {
  calls: {
    listStems(params: { trackIndex: number }): Promise<string[]>;
    ping(): string;
    explode(): void;
    /** A parameter that looks like the options object, which must not be read as one. */
    save(params: { signal?: string }): string;
    /** A parameter with no fields at all, for the same reason. */
    clear(params: Record<string, never>): string;
    slow(params: { ms: number }): string;
  };
  events: {
    progress: { done: number; total: number };
    finished: void;
  };
}

/** Every run and page channel the test opened, torn down whichever way the test ended. */
const opened: Array<() => void | Promise<void>> = [];

afterEach(async () => {
  for (const close of opened.reverse()) {
    await close();
  }
  opened.length = 0;
});

/** A directory holding one hello-world page. */
async function helloWorldAssets(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "ace-ui-"));
  await writeFile(join(dir, "index.html"), HELLO, "utf8");
  return dir;
}

/**
 * Start a persistent run that has declared the paved road, and wait until its page is
 * served and announced — which is the state every UI test starts from.
 */
async function startServed(
  options: { window?: SurfaceWindow; grantedTokens?: readonly string[] } = {},
): Promise<{
  run: Run<typeof manifest>;
  window: SurfaceWindow;
  context: ExtensionContext<typeof manifest>;
  url: string;
  assets: string;
}> {
  const window = options.window ?? new SurfaceWindow();
  const assets = await helloWorldAssets();
  const activated = signal<ExtensionContext<typeof manifest>>();
  const run = startRun(
    { manifest, ui: { assets }, activate: (context) => activated.announce(context) },
    { host: { grantedTokens: options.grantedTokens ?? [SURFACE_TOKEN], methods: window.methods() } },
  );
  opened.push(() => {
    run.extension.exitCode.catch(() => undefined);
    run.host.close();
  });
  const context = await activated.reached;
  const url = context.ui.url;
  expect(url).toBeTypeOf("string");
  return { run, window, context, url: url as string, assets };
}

/** A page channel pointed at a served URL, closed when the test ends. */
function openPage(url: string) {
  const channel = connectChannel<StemsUi>({ url });
  opened.push(() => {
    channel.close();
  });
  return channel;
}

/** Wait for `check` to hold, so a test can observe a push without sleeping on a guess. */
async function eventually(check: () => boolean): Promise<void> {
  await expect.poll(check, { timeout: 2_000, interval: 10 }).toBe(true);
}

test("the wire names the host script spells are the ones the surface declares", () => {
  expect(Object.keys(WORKFLOWUI_METHOD_CAPABILITIES).sort()).toEqual(Object.values(SURFACE_METHODS).sort());
  expect(new Set(Object.values(WORKFLOWUI_METHOD_CAPABILITIES))).toEqual(new Set([SURFACE_TOKEN]));
});

test("declaring `ui: { assets }` serves the page and announces the URL it is served from", async () => {
  const { window, url } = await startServed();

  expect(window.announced).toEqual([url]);
  expect(url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);

  const page = await fetch(url);
  expect(page.headers.get("content-type")).toBe("text/html; charset=utf-8");
  await expect(page.text()).resolves.toContain("hello world");
});

test("a typed call and a typed event round-trip over the shared protocol type", async () => {
  const { context, url } = await startServed();
  const channel = context.ui.channel<StemsUi>();
  channel.handle("listStems", ({ trackIndex }) => Promise.resolve([`stem-${String(trackIndex)}`, "vocals"]));

  const page = openPage(url);
  const pushed: Array<{ done: number; total: number }> = [];
  page.on("progress", (payload) => pushed.push(payload));

  await expect(page.call("listStems", { trackIndex: 3 })).resolves.toEqual(["stem-3", "vocals"]);

  // Emitted once the page's stream is attached: a push has no queue behind it, so
  // there is nothing for a page that connects later to catch up on.
  await eventually(() => {
    channel.emit("progress", { done: 1, total: 4 });
    return pushed.length > 0;
  });
  expect(pushed.at(-1)).toEqual({ done: 1, total: 4 });
});

test("a call that takes nothing needs no argument, and an event that carries nothing needs no payload", async () => {
  const { context, url } = await startServed();
  const channel = context.ui.channel<StemsUi>();
  channel.handle("ping", () => "pong");

  const page = openPage(url);
  let finished = 0;
  page.on("finished", () => (finished += 1));

  await expect(page.call("ping")).resolves.toBe("pong");
  await eventually(() => {
    channel.emit("finished");
    return finished > 0;
  });
});

test("a parameter is never mistaken for the options object", async () => {
  const { context, url } = await startServed();
  const channel = context.ui.channel<StemsUi>();
  channel.handle("save", (params) => JSON.stringify(params));
  channel.handle("clear", (params) => JSON.stringify(params));

  const page = openPage(url);
  // Both of these would be read as options by anything that guessed from shape, and
  // the handler would be handed nothing.
  await expect(page.call("save", { signal: "sigterm" })).resolves.toBe('{"signal":"sigterm"}');
  await expect(page.call("clear", {})).resolves.toBe("{}");
});

test("a call can be abandoned by its caller", async () => {
  const { context, url } = await startServed();
  const channel = context.ui.channel<StemsUi>();
  const started = signal();
  channel.handle("slow", async ({ ms }) => {
    started.announce();
    await new Promise((done) => setTimeout(done, ms));
    return "finished";
  });

  const page = openPage(url);
  const abort = new AbortController();
  const call = page.call("slow", { ms: 1_000 }, { signal: abort.signal });
  await started.reached;
  abort.abort();
  await expect(call).rejects.toThrow();
});

test("a handler that throws fails that one call, with the reason the process reported", async () => {
  const { context, url } = await startServed();
  const channel = context.ui.channel<StemsUi>();
  channel.handle("explode", () => {
    throw new Error("no stems in an empty project");
  });
  channel.handle("ping", () => "pong");

  const page = openPage(url);
  await expect(page.call("explode")).rejects.toThrow("no stems in an empty project");
  // The channel is still there: one failing handler is not a failing channel.
  await expect(page.call("ping")).resolves.toBe("pong");
});

test("a call nothing handles is refused by name", async () => {
  const { url } = await startServed();
  const page = openPage(url);
  await expect(page.call("listStems", { trackIndex: 0 })).rejects.toThrow(/handles no UI call named "listStems"/);
});

test("registering a second handler for one call is refused", async () => {
  const { context } = await startServed();
  const channel = context.ui.channel<StemsUi>();
  channel.handle("ping", () => "pong");
  expect(() => channel.handle("ping", () => "again")).toThrow(/already has a handler/);
});

test("an event stream that fails to open is re-opened, so the page keeps hearing", async () => {
  const { context, url } = await startServed();
  const channel = context.ui.channel<StemsUi>();

  // The process can go away and come back under a page that is still on screen. The
  // first attempt is refused here, standing in for that window.
  const realFetch = globalThis.fetch;
  let streamAttempts = 0;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = init?.headers as Record<string, string> | undefined;
    if (headers?.accept === "text/event-stream") {
      streamAttempts += 1;
      if (streamAttempts === 1) {
        throw new Error("the process is not listening yet");
      }
    }
    return realFetch(input, init);
  }) as typeof fetch;
  opened.push(() => {
    globalThis.fetch = realFetch;
  });

  const page = openPage(url);
  const pushed: unknown[] = [];
  page.on("progress", (payload) => pushed.push(payload));

  await eventually(() => {
    channel.emit("progress", { done: 1, total: 1 });
    return pushed.length > 0;
  });
  expect(streamAttempts).toBeGreaterThan(1);
});

test("emitting with no page connected is dropped, not queued", async () => {
  const { context, url } = await startServed();
  const channel = context.ui.channel<StemsUi>();
  expect(() => channel.emit("progress", { done: 1, total: 2 })).not.toThrow();

  const page = openPage(url);
  const pushed: unknown[] = [];
  page.on("progress", (payload) => pushed.push(payload));
  channel.handle("ping", () => "pong");
  // A round-trip the page can await, so "nothing arrived" is a state the test reached
  // rather than a sleep it hoped was long enough.
  await expect(page.call("ping")).resolves.toBe("pong");
  expect(pushed).toEqual([]);
});

test("`announceSurface` is the direct path for an extension serving its own page", async () => {
  const window = new SurfaceWindow();
  const activated = signal<ExtensionContext<typeof manifest>>();
  const run = startRun(
    { manifest, activate: (context) => activated.announce(context) },
    { host: { grantedTokens: [SURFACE_TOKEN], methods: window.methods() } },
  );
  opened.push(() => {
    run.extension.exitCode.catch(() => undefined);
    run.host.close();
  });
  const context = await activated.reached;

  // Nothing was served and nothing was announced: this extension has its own server.
  expect(context.ui.url).toBeUndefined();
  expect(window.announced).toEqual([]);

  await context.ui.announceSurface("http://127.0.0.1:5173/");
  expect(window.announced).toEqual(["http://127.0.0.1:5173/"]);
  expect(context.ui.url).toBe("http://127.0.0.1:5173/");

  await context.ui.navigate("http://127.0.0.1:5173/settings");
  await context.ui.reload();
  expect(window.navigated).toEqual(["http://127.0.0.1:5173/settings"]);
  expect(window.reloads).toBe(1);
  // Navigating does not replace what a reload goes back to.
  expect(context.ui.url).toBe("http://127.0.0.1:5173/");
});

test("a URL the host refuses is not what a reload would go back to", async () => {
  const window = new SurfaceWindow();
  const activated = signal<ExtensionContext<typeof manifest>>();
  const run = startRun(
    { manifest, activate: (context) => activated.announce(context) },
    { host: { grantedTokens: [SURFACE_TOKEN], methods: window.methods() } },
  );
  opened.push(() => {
    run.extension.exitCode.catch(() => undefined);
    run.host.close();
  });
  const context = await activated.reached;

  window.refuse = { code: -32602, message: "that URL is not on loopback" };
  await expect(context.ui.announceSurface("http://example.com/")).rejects.toThrow(/not on loopback/);
  expect(context.ui.url).toBeUndefined();
});

test("a session that does not reach `workflow.ui` is refused before the wire", async () => {
  const window = new SurfaceWindow();
  const activated = signal<ExtensionContext<typeof manifest>>();
  const run = startRun(
    { manifest, activate: (context) => activated.announce(context) },
    { host: { grantedTokens: [], methods: window.methods() } },
  );
  opened.push(() => {
    run.extension.exitCode.catch(() => undefined);
    run.host.close();
  });
  const context = await activated.reached;

  const refused = await context.ui.announceSurface("http://127.0.0.1:5173/").catch((error: unknown) => error);
  expect(isCode(refused, "CAPABILITY_DENIED")).toBe(true);
  expect(window.announced).toEqual([]);
});

test("a declared UI that cannot be served never starts the run", async () => {
  const window = new SurfaceWindow();
  const run = startRun(
    { manifest, ui: { assets: join(tmpdir(), "ace-ui-does-not-exist") }, activate: () => undefined },
    { host: { grantedTokens: [SURFACE_TOKEN], methods: window.methods() } },
  );
  await expect(run.exitCode).resolves.toBe(2);
  expect(window.announced).toEqual([]);
});

test("a declared UI the session cannot present says which capability is missing", async () => {
  const window = new SurfaceWindow();
  const logged: string[] = [];
  const reportedTo = vi.spyOn(console, "error").mockImplementation((line: string) => logged.push(line));
  const assets = await helloWorldAssets();
  const run = startRun(
    { manifest, ui: { assets }, activate: () => undefined },
    { host: { grantedTokens: [], methods: window.methods() } },
  );

  // The page was served, but a window that cannot be presented is not a run to start:
  // an extension whose whole interface is unreachable has nothing to offer its user.
  await expect(run.exitCode).resolves.toBe(2);
  expect(window.announced).toEqual([]);
  expect(logged.join("\n")).toContain(SURFACE_TOKEN);
  reportedTo.mockRestore();
});

test("the served page cannot be used to read files outside the assets directory", async () => {
  const { url } = await startServed();
  for (const path of ["../../etc/passwd", "..%2f..%2fetc%2fpasswd", "%2e%2e/%2e%2e/etc/passwd"]) {
    const response = await fetch(new URL(path, url));
    expect([403, 404]).toContain(response.status);
  }
});

test("the channel refuses a request that came from another origin", async () => {
  const { url } = await startServed();
  const response = await fetch(new URL("/__ace/channel", url), {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://evil.example" },
    body: JSON.stringify({ id: 1, name: "ping" }),
  });
  expect(response.status).toBe(403);
});

/**
 * Readable by its owner is what makes the unreadable-file case reachable at all, so a
 * root process — which opens anything regardless of mode — cannot exercise it.
 */
const enforcesFileModes = process.platform !== "win32" && process.getuid?.() !== 0;

test.skipIf(!enforcesFileModes)("a file that cannot be opened does not take the process down", async () => {
  const { url, assets } = await startServed();
  const locked = join(assets, "locked.css");
  await writeFile(locked, "body{}", "utf8");
  // Passes the stat — a real file of a known size — and then fails to open, the way a
  // file deleted or chmod-ed between those two moments does. Left unhandled, the read
  // stream's error is an uncaught exception in the extension's own process.
  await chmod(locked, 0o000);

  // However this request ends for the browser, it must not end the server.
  await fetch(new URL("locked.css", url)).then(
    (response) => response.arrayBuffer().catch(() => undefined),
    () => undefined,
  );

  // Still serving: the unreadable asset cost that one response and nothing more.
  expect(await (await fetch(url)).text()).toBe(HELLO);
});

test("stopping the run stops serving the page", async () => {
  const { run, context, url } = await startServed();
  context.exit(0);
  await expect(run.exitCode).resolves.toBe(0);
  await expect(fetch(url)).rejects.toThrow();
});
