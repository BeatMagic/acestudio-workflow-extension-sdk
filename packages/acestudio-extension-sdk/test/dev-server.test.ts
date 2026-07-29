/**
 * `ui.devServerUrl`: honored when ACE Studio dev-loaded the extension, inert when it
 * did not, and reachable from the page either way.
 *
 * The gate is the point. A packaged extension that ships the field must behave as if
 * it had not, because the alternative is a user's window pointed at a dev server that
 * is not running — so both sides of that gate are exercised here, and the environment
 * variable is set the way the host sets it rather than mocked away.
 */

import { afterEach, expect, test, vi } from "vitest";
import type { UiProtocol } from "@timedomain/acestudio-extension-sdk";
import { connectChannel } from "@timedomain/acestudio-extension-sdk/page";
import { BRIDGE_TOKEN_ENV, DEV_LOADED_ENV } from "../src/spawn-env.js";
import { CHANNEL_ORIGIN_PARAM } from "../src/ui/protocol.js";
import { AUTH_TOKEN, startRun } from "./support/extension-run.js";
import { helloWorldAssets, HELLO, manifest, SURFACE_TOKEN, uiHarness } from "./support/served-ui.js";
import { SurfaceWindow } from "./support/surface-window.js";

const ui = uiHarness();
afterEach(ui.teardown);

/** Where the developer's dev server would be listening. Nothing has to be there. */
const DEV_SERVER = "http://127.0.0.1:5173/";

/** The environment ACE Studio composes for a folder-loaded extension. */
const DEV_LOADED = { [DEV_LOADED_ENV]: "1" };

interface EditorUi extends UiProtocol {
  calls: { ping(): string };
  events: { progress: { done: number } };
}

/** The loopback origin the announced URL carries the channel on. */
function channelOrigin(announced: string): string {
  const origin = new URL(announced).searchParams.get(CHANNEL_ORIGIN_PARAM);
  expect(origin).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
  return origin as string;
}

test("a dev-loaded extension announces its dev server, with the channel's origin attached", async () => {
  const { window, url } = await ui.startServed({ env: DEV_LOADED, ui: { devServerUrl: DEV_SERVER } });

  expect(window.announced).toEqual([url]);
  expect(url.startsWith(DEV_SERVER)).toBe(true);
  // The page cannot guess a port the OS chose at startup, so the announcement carries
  // it — which is what makes `connectChannel()` need no configuration in dev.
  expect(channelOrigin(url)).toBeTypeOf("string");
});

test("while the dev server has the page, the built assets are not served beside it", async () => {
  const { url } = await ui.startServed({ env: DEV_LOADED, ui: { devServerUrl: DEV_SERVER } });
  const loopback = channelOrigin(url);

  // A request that would have found a stale build finds nothing instead, and says why.
  const page = await fetch(`${loopback}/`);
  expect(page.status).toBe(404);
  await expect(page.text()).resolves.toContain("dev server");
});

test("the channel is still on loopback, and answers the page the dev server serves", async () => {
  const { context, url } = await ui.startServed({ env: DEV_LOADED, ui: { devServerUrl: DEV_SERVER } });
  context.ui.channel<EditorUi>().handle("ping", () => "pong");
  const loopback = channelOrigin(url);

  // The `Origin` a page on the dev server's port sends, which the channel accepts
  // because that is where this extension's page is being served from.
  const answered = await fetch(`${loopback}/__ace/channel`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: new URL(DEV_SERVER).origin },
    body: JSON.stringify({ id: 1, name: "ping" }),
  });
  expect(answered.status).toBe(200);
  await expect(answered.json()).resolves.toEqual({ id: 1, result: "pong" });

  // Somebody else's page is still refused: honoring the dev server widens the door by
  // exactly one origin.
  const refused = await fetch(`${loopback}/__ace/channel`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://evil.example" },
    body: JSON.stringify({ id: 2, name: "ping" }),
  });
  expect(refused.status).toBe(403);
});

/**
 * The next four tests are about CORS, which is the thing this arrangement stands or
 * falls on and the thing a test in this runner cannot witness directly: Node's `fetch`
 * does not enforce it, so a passing `call()` here proves nothing about a webview. What
 * they assert instead is what a browser would be *told* — because with the page on the
 * dev server's origin and the channel on loopback, every call is cross-origin, and
 * neither content type the channel speaks is safelisted.
 */
test("the channel answers the preflight a browser sends ahead of every call", async () => {
  const { url } = await ui.startServed({ env: DEV_LOADED, ui: { devServerUrl: DEV_SERVER } });
  const loopback = channelOrigin(url);
  const devOrigin = new URL(DEV_SERVER).origin;

  const preflight = await fetch(`${loopback}/__ace/channel`, {
    method: "OPTIONS",
    headers: {
      origin: devOrigin,
      "access-control-request-method": "POST",
      "access-control-request-headers": "content-type",
    },
  });

  expect(preflight.status).toBe(204);
  expect(preflight.headers.get("access-control-allow-origin")).toBe(devOrigin);
  expect(preflight.headers.get("access-control-allow-methods")).toContain("POST");
  expect(preflight.headers.get("access-control-allow-headers")).toContain("content-type");
});

test("the call, the event stream, and a served asset all say the page may read them", async () => {
  const { context, url } = await ui.startServed({ env: DEV_LOADED, ui: { devServerUrl: DEV_SERVER } });
  context.ui.channel<EditorUi>().handle("ping", () => "pong");
  const handle = context.ui.serveAsset(new TextEncoder().encode("audio bytes"));
  const loopback = channelOrigin(url);
  const from = { origin: new URL(DEV_SERVER).origin };

  const answered = await fetch(`${loopback}/__ace/channel`, {
    method: "POST",
    headers: { "content-type": "application/json", ...from },
    body: JSON.stringify({ id: 1, name: "ping" }),
  });
  expect(answered.headers.get("access-control-allow-origin")).toBe(from.origin);

  const stream = await fetch(`${loopback}/__ace/channel`, { headers: from });
  expect(stream.headers.get("access-control-allow-origin")).toBe(from.origin);
  await stream.body?.cancel();

  // A page may fetch an asset rather than hand the URL to an element, and a ranged fetch
  // is worthless if the range headers stay invisible to it.
  const bytes = await fetch(handle.url, { headers: from });
  expect(bytes.headers.get("access-control-allow-origin")).toBe(from.origin);
  expect(bytes.headers.get("access-control-expose-headers")).toContain("content-range");
});

test("a served asset answers the preflight a ranged fetch arrives with", async () => {
  const { context, url } = await ui.startServed({ env: DEV_LOADED, ui: { devServerUrl: DEV_SERVER } });
  const handle = context.ui.serveAsset(new TextEncoder().encode("audio bytes"));
  const devOrigin = new URL(DEV_SERVER).origin;
  expect(handle.url.startsWith(channelOrigin(url))).toBe(true);

  // `range` is not a safelisted request header, so asking for one cross-origin costs a
  // preflight of its own — and refusing it would leave a dev-server page able to fetch an
  // asset whole and unable to seek inside it, which is the reason ranges are answered.
  const preflight = await fetch(handle.url, {
    method: "OPTIONS",
    headers: {
      origin: devOrigin,
      "access-control-request-method": "GET",
      "access-control-request-headers": "range",
    },
  });

  expect(preflight.status).toBe(204);
  expect(preflight.headers.get("access-control-allow-origin")).toBe(devOrigin);
  expect(preflight.headers.get("access-control-allow-methods")).toContain("GET");
  expect(preflight.headers.get("access-control-allow-headers")).toContain("range");
});

test("a foreign page is told nothing, so the permission widens by one origin only", async () => {
  const { context, url } = await ui.startServed({ env: DEV_LOADED, ui: { devServerUrl: DEV_SERVER } });
  const handle = context.ui.serveAsset(new TextEncoder().encode("audio bytes"));
  const loopback = channelOrigin(url);
  const evil = { origin: "http://evil.example" };

  const preflight = await fetch(`${loopback}/__ace/channel`, {
    method: "OPTIONS",
    headers: { ...evil, "access-control-request-method": "POST" },
  });
  expect(preflight.status).toBe(403);
  expect(preflight.headers.get("access-control-allow-origin")).toBeNull();

  // The token still guards the bytes, but a page that somehow learned one is not also
  // handed permission to read what it addresses.
  const bytes = await fetch(handle.url, { headers: evil });
  expect(bytes.headers.get("access-control-allow-origin")).toBeNull();

  // An asset's preflight is answered for anyone, since the route deliberately checks no
  // `Origin` — withholding the permission is what stops a foreign page reading the answer.
  const assetPreflight = await fetch(handle.url, {
    method: "OPTIONS",
    headers: { ...evil, "access-control-request-method": "GET", "access-control-request-headers": "range" },
  });
  expect(assetPreflight.status).toBe(204);
  expect(assetPreflight.headers.get("access-control-allow-origin")).toBeNull();
});

test("the page finds its process from the announced URL, with nothing configured", async () => {
  const { context, url } = await ui.startServed({ env: DEV_LOADED, ui: { devServerUrl: DEV_SERVER } });
  context.ui.channel<EditorUi>().handle("ping", () => "pong");

  // The one thing a test runner cannot have: a document loaded from a URL. This is the
  // URL the window was pointed at, which is where the page reads the channel's origin
  // from — so `connectChannel()` is called exactly as a page would call it.
  const globals = globalThis as { location?: { href: string } };
  const had = globals.location;
  globals.location = { href: url };
  ui.track(() => {
    if (had === undefined) {
      delete globals.location;
      return;
    }
    globals.location = had;
  });

  const page = connectChannel<EditorUi>();
  ui.track(() => {
    page.close();
  });
  await expect(page.call("ping")).resolves.toBe("pong");
});

test("a packaged extension carrying `devServerUrl` is served from its assets instead", async () => {
  // No dev-loaded variable: this is what a user's machine looks like.
  const { window, url } = await ui.startServed({ ui: { devServerUrl: DEV_SERVER } });

  expect(url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);
  expect(window.announced).toEqual([url]);
  expect(url).not.toContain(CHANNEL_ORIGIN_PARAM);
  await expect((await fetch(url)).text()).resolves.toBe(HELLO);
});

test("a host that says the flag is off means off", async () => {
  const { url } = await ui.startServed({ env: { [DEV_LOADED_ENV]: "0" }, ui: { devServerUrl: DEV_SERVER } });

  expect(url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);
  await expect((await fetch(url)).text()).resolves.toBe(HELLO);
});

test("a `devServerUrl` that is not a URL fails the run rather than announcing nonsense", async () => {
  const window = new SurfaceWindow();
  const logged: string[] = [];
  const reportedTo = vi.spyOn(console, "error").mockImplementation((line: string) => logged.push(line));
  const run = startRun(
    { manifest, ui: { assets: await helloWorldAssets(), devServerUrl: "5173" }, activate: () => undefined },
    {
      host: { grantedTokens: [SURFACE_TOKEN], methods: window.methods() },
      env: { [BRIDGE_TOKEN_ENV]: AUTH_TOKEN, ...DEV_LOADED },
    },
  );

  // The run never starts: a window pointed at a URL the developer mistyped is worse
  // than an extension that says which declaration is wrong.
  await expect(run.exitCode).resolves.toBe(2);
  expect(window.announced).toEqual([]);
  expect(logged.join("\n")).toContain("devServerUrl");
  reportedTo.mockRestore();
});
