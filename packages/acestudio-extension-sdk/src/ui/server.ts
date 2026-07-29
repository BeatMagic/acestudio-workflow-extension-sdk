/**
 * The embedded loopback server: the paved road for serving an extension's page.
 *
 * @remarks
 * An extension that declares `ui: { assets }` gets a static server on loopback and
 * an announced URL, and never writes any of this. An extension that would rather
 * run its own server — a Next.js app, a Vite dev server, anything — skips it
 * entirely and announces its own URL instead; the paved road is a convenience, not
 * the way in.
 *
 * Three things are deliberate. The listener binds to `127.0.0.1`, so nothing off this
 * machine can reach an extension's page or its channel. The channel's routes are
 * refused when the request carries a foreign `Origin`, so a page the user happens to
 * have open elsewhere cannot drive somebody's extension from across the browser. And
 * a served asset's URL is exempt from that check, because a browser sends no `Origin`
 * when an element loads a `src` — its unguessable token is what guards it.
 *
 * The server runs whenever `ui` is declared, including when a dev server is what
 * serves the page: the channel and the served assets live here either way.
 */

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import type { Readable } from "node:stream";
import type { DebugLog } from "@timedomain/acestudio-bridge-core";
import { ExtensionError } from "../errors.js";
import { decodeMessage, encodeMessage, isBinaryContentType } from "./binary.js";
import type { ChannelHub, EventSink } from "./channel.js";
import { resolveRange, type AssetEntry, type AssetRegistry } from "./assets.js";
import {
  CHANNEL_PATH,
  frameEvent,
  ASSET_PATH,
  type CallRequest,
  type CallResponse,
  type EventMessage,
} from "./protocol.js";

/** The address family the server serves on, and the only one it will. */
const LOOPBACK_HOST = "127.0.0.1";

/** What a JSON request body may be, past which it is not a channel call. */
const MAX_CALL_BYTES = 8 * 1024 * 1024;

/**
 * What a *binary* call may be. Larger, because carrying an upload is the point of
 * one — and still bounded, because the body is held in memory to decode: a transfer
 * bigger than this belongs on disk, with the path travelling over the channel.
 */
const MAX_BINARY_CALL_BYTES = 64 * 1024 * 1024;

/** The file a directory request serves. */
const INDEX_FILE = "index.html";

/** What bytes are served as when nobody said and nothing can be inferred. */
const OCTET_STREAM = "application/octet-stream";

/**
 * Content types by extension. Deliberately short: it covers what a built web app is
 * made of and what a media element is pointed at, and anything else is served as
 * bytes, which every browser handles by asking rather than by guessing wrong.
 */
const CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".aac": "audio/aac",
  ".css": "text/css; charset=utf-8",
  ".flac": "audio/flac",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/vnd.microsoft.icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".m4a": "audio/mp4",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".oga": "audio/ogg",
  ".ogg": "audio/ogg",
  ".opus": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".wav": "audio/wav",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/**
 * The paved road, declared on `defineExtension`: point it at the built page and the
 * SDK serves it on loopback and announces the URL.
 *
 * An extension that runs its own server declares nothing here and calls
 * {@link ExtensionUi.announceSurface} with its own URL instead.
 *
 * @public
 */
export interface ExtensionUiOptions {
  /**
   * The directory holding the built page — the folder with `index.html` in it.
   * Resolved against the process's working directory, which the manifest's `cwd`
   * decides and which defaults to the entry script's own directory.
   */
  readonly assets: string;
  /**
   * A dev server to announce instead of the built page — a Vite server, or whatever
   * else rebuilds the page while its author edits it.
   *
   * **Honored only when ACE Studio spawned this extension dev-loaded** (ADR 0094 §11;
   * the option itself is ADR 0091 §4).
   * A packaged extension carrying this field is served from
   * {@link ExtensionUiOptions.assets} as if the field were not there, so one shipped
   * by accident cannot point a user's window at a server that is not running.
   *
   * While it is honored, `assets` is not served at all: the dev server owns the page,
   * and a stale build answering alongside it is a confusing place for a request to
   * land. The channel and the served assets stay on the loopback server, and the
   * announced URL carries their origin — so `connectChannel()` in the page finds the
   * process with nothing to configure.
   */
  readonly devServerUrl?: string;
}

/**
 * A running loopback server: where it is, and how to stop it.
 *
 * @internal
 */
export interface UiServer {
  /** The URL the page is served from, when this server is what serves it. */
  readonly url: string;
  /** Stop listening and drop every connected page. */
  close(): Promise<void>;
}

/**
 * What the loopback server carries, and for whom.
 *
 * @internal
 */
export interface ServeUiOptions {
  /**
   * The directory holding the built page, or `undefined` when a dev server is serving
   * it — in which case this server carries the channel and the served assets only.
   */
  readonly pageRoot: string | undefined;
  /** The channel to route calls and event streams to. */
  readonly hub: ChannelHub;
  /** The runtime assets to answer for, the ones `ctx.ui.serveAsset()` put there. */
  readonly assets: AssetRegistry;
  /**
   * Where the page comes from, when it does not come from here. Its origin is
   * accepted by the channel alongside this server's own, which is what lets a page on
   * a dev server's port make calls.
   */
  readonly pageUrl?: string;
  /** Where this server says what it served. */
  readonly debug: DebugLog;
}

/** Everything a request handler needs, gathered once. */
interface Routes {
  readonly root: string | undefined;
  readonly hub: ChannelHub;
  readonly assets: AssetRegistry;
  readonly pageOrigin: string | undefined;
  readonly debug: DebugLog;
}

/**
 * Serve the channel, the assets an extension serves at runtime, and — unless a dev
 * server has the page — the built page, on loopback.
 *
 * The port is whatever the OS hands out: an extension has no business asking for a
 * fixed one, and the URL is announced rather than guessed at.
 *
 * @throws ExtensionError when the page directory is missing — an extension that
 * declared a UI and shipped no files is a broken bundle, and finding out at startup
 * beats finding out from an empty window.
 *
 * @internal
 */
export async function serveUi(options: ServeUiOptions): Promise<UiServer> {
  const { pageRoot, hub, assets, debug } = options;
  if (pageRoot !== undefined) {
    await requireDirectory(resolve(pageRoot), pageRoot);
  }
  const routes: Routes = {
    root: pageRoot === undefined ? undefined : resolve(pageRoot),
    hub,
    assets,
    pageOrigin: originOf(options.pageUrl),
    debug,
  };

  const server = createServer((request, response) => {
    void route(request, response, routes);
  });
  const port = await listen(server);
  const url = `http://${LOOPBACK_HOST}:${String(port)}/`;
  debug(`ui: serving ${routes.root === undefined ? "the channel and its assets" : "the page"} at ${url}`);
  return {
    url,
    close: async () => {
      hub.detachAll();
      assets.revokeAll();
      await new Promise<void>((done) => {
        // Sockets held open by an event stream would keep `close` waiting for as
        // long as the page stays on screen, so they are cut rather than drained.
        server.closeAllConnections();
        server.close(() => {
          done();
        });
      });
      debug("ui: stopped serving");
    },
  };
}

async function requireDirectory(root: string, asWritten: string): Promise<void> {
  const found = await stat(root).catch(() => undefined);
  if (found?.isDirectory() !== true) {
    throw new ExtensionError(`the UI assets directory ${asWritten} is not there`, {
      hint: "`ui.assets` is resolved against the process's working directory; point it at the folder holding the built page",
    });
  }
}

/**
 * The origin of a URL, or `undefined` when it is not one.
 *
 * The paved road refuses an unparseable `devServerUrl` before it gets here, so the
 * fallback is for a caller that hands over its own `pageUrl` — and "nobody extra" is
 * the safe reading of nonsense when the question is whose calls to accept.
 */
function originOf(url: string | undefined): string | undefined {
  if (url === undefined) {
    return undefined;
  }
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

async function listen(server: Server): Promise<number> {
  return new Promise<number>((done, fail) => {
    server.once("error", fail);
    server.listen(0, LOOPBACK_HOST, () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        fail(new ExtensionError("the UI server started on no port this process can name"));
        return;
      }
      server.removeListener("error", fail);
      done(address.port);
    });
  });
}

async function route(request: IncomingMessage, response: ServerResponse, routes: Routes): Promise<void> {
  const path = requestPath(request);
  if (path === CHANNEL_PATH) {
    await serveChannel(request, response, routes);
    return;
  }
  if (path.startsWith(ASSET_PATH)) {
    await serveAsset(request, response, routes, path.slice(ASSET_PATH.length));
    return;
  }
  if (routes.root === undefined) {
    refuse(response, 404, "this extension's page is served by its dev server, not from here");
    return;
  }
  await servePageFile(request, response, routes.root, path);
}

/**
 * The request's path, with the query dropped. A request line that is not a path at
 * all yields `/`, which serves the index — there is nothing better to do with it,
 * and the alternative is a 400 for a browser quirk nobody can act on.
 */
function requestPath(request: IncomingMessage): string {
  const target = request.url ?? "/";
  const query = target.indexOf("?");
  const path = query === -1 ? target : target.slice(0, query);
  return path.startsWith("/") ? path : "/";
}

async function serveChannel(request: IncomingMessage, response: ServerResponse, routes: Routes): Promise<void> {
  if (!sameOrigin(request, routes.pageOrigin)) {
    refuse(response, 403, "the channel is reachable from this extension's own page only");
    return;
  }
  allowCrossOrigin(request, response, routes.pageOrigin);
  if (request.method === "OPTIONS") {
    answerPreflight(response, "GET, POST", "content-type");
    return;
  }
  if (request.method === "GET") {
    streamEvents(request, response, routes);
    return;
  }
  if (request.method === "POST") {
    await answerCall(request, response, routes);
    return;
  }
  refuseMethod(response, "GET, POST", "the channel answers GET (events) and POST (calls)");
}

/**
 * Tell a browser it may read this answer.
 *
 * When a dev server serves the page (`ui.devServerUrl`), the page's origin is that
 * server's and the channel's is loopback — so every call is a cross-origin request,
 * and without this header the browser withholds the response from the page that asked
 * for it. Nothing is widened by echoing: the origin is one {@link sameOrigin} has
 * already accepted, and the channel carries no credentials for a header to leak.
 *
 * `vary` because the answer differs by origin, so a cache must not hand one page the
 * permission granted to another.
 */
function allowCrossOrigin(
  request: IncomingMessage,
  response: ServerResponse,
  pageOrigin: string | undefined,
  expose?: string,
): void {
  const origin = request.headers.origin;
  if (origin === undefined || !sameOrigin(request, pageOrigin)) {
    return;
  }
  response.setHeader("access-control-allow-origin", origin);
  response.setHeader("vary", "origin");
  if (expose !== undefined) {
    // Only a handful of response headers reach cross-origin JavaScript by default,
    // and the ones that describe a byte range are not among them.
    response.setHeader("access-control-expose-headers", expose);
  }
}

/**
 * Answer the request a browser sends before it will make a cross-origin one.
 *
 * Every route here needs this, because everything worth asking for crosses the
 * safelist: neither content type the channel speaks is safelisted, and neither is a
 * `range` header. So a preflight precedes each real request — which is why it is worth
 * a `max-age` rather than being asked and answered thousands of times over one page's
 * life.
 *
 * The permission to *read* the answer is {@link allowCrossOrigin}'s and is set by the
 * caller before this, so a preflight from an origin the route does not accept is still
 * answered — with nothing in it that lets the asking page proceed.
 */
function answerPreflight(response: ServerResponse, methods: string, headers: string): void {
  response.writeHead(204, {
    "access-control-allow-methods": methods,
    "access-control-allow-headers": headers,
    "access-control-max-age": "600",
  });
  response.end();
}

/**
 * Whether the request came from the page this server serves. A browser sends no
 * `Origin` on a same-origin `GET`, and sends one on every cross-origin request and
 * every `POST` — so the check is "absent, ours, or the dev server's", and a foreign
 * page's fetch is refused before it reaches a handler.
 *
 * This is not a defence against another program on the machine, which can send
 * whatever headers it likes. Loopback is the boundary there.
 */
function sameOrigin(request: IncomingMessage, pageOrigin: string | undefined): boolean {
  const origin = request.headers.origin;
  if (origin === undefined) {
    return true;
  }
  if (pageOrigin !== undefined && origin === pageOrigin) {
    return true;
  }
  const host = request.headers.host;
  return host !== undefined && origin === `http://${host}`;
}

function streamEvents(request: IncomingMessage, response: ServerResponse, routes: Routes): void {
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": "text/event-stream",
    connection: "keep-alive",
  });
  // Nagle's algorithm would hold a small frame back waiting for company, which for a
  // progress push is exactly the wrong trade — a stream's whole value is that an
  // event arrives when it happens.
  request.socket.setNoDelay(true);
  response.flushHeaders();

  const sink: EventSink = {
    write: (event: EventMessage) => {
      response.write(frameEvent(event));
    },
  };
  const detach = routes.hub.attach(sink);
  routes.debug("ui: a page opened the event stream");
  request.on("close", detach);
  response.on("close", detach);
}

async function answerCall(request: IncomingMessage, response: ServerResponse, routes: Routes): Promise<void> {
  const contentType = request.headers["content-type"];
  const binary = isBinaryContentType(contentType);
  let call: CallRequest;
  try {
    const body = await readBody(request, binary ? MAX_BINARY_CALL_BYTES : MAX_CALL_BYTES);
    call = parseCall(decodeMessage(contentType, body));
  } catch (error) {
    refuse(response, 400, error instanceof Error ? error.message : "unreadable call");
    return;
  }
  routes.debug(`ui call ${call.name}${binary ? ", carrying bytes" : ""}`);
  const answer: CallResponse = await routes.hub.invoke(call);
  const encoded = await encodeMessage(answer).catch(() => undefined);
  if (encoded === undefined) {
    // The handler answered something this channel cannot carry — a `Blob` whose bytes
    // would not read, most likely. The call is over either way, so the page is told
    // rather than left waiting on a response that is never coming.
    refuse(response, 500, `the answer to "${call.name}" could not be encoded`);
    return;
  }
  response.writeHead(200, { "cache-control": "no-store", "content-type": encoded.contentType });
  response.end(encoded.body);
}

/**
 * A call is refused as malformed only when it is not a call at all. Whether the
 * *parameters* are right is the handler's business, and the protocol type is what
 * settles it before either side runs.
 */
function parseCall(body: unknown): CallRequest {
  const call = body as Partial<CallRequest> | null;
  if (typeof call?.id !== "number" || typeof call.name !== "string") {
    throw new Error("a channel call needs a numeric id and a call name");
  }
  return { id: call.id, name: call.name, ...(call.params === undefined ? {} : { params: call.params }) };
}

async function readBody(request: IncomingMessage, limit: number): Promise<Uint8Array> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = chunk as Buffer;
    size += buffer.byteLength;
    if (size > limit) {
      throw new Error("this call's body is larger than the channel accepts");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

/**
 * Serve one served asset's bytes, answering byte ranges so a media element can seek.
 *
 * No `Origin` check, unlike the channel: a browser sends none when an element loads
 * a `src`, so a check here would refuse the page this exists for. The token in the URL
 * is the guard, and revoking is how it stops working.
 *
 * A page may also `fetch` these bytes rather than hand the URL to an element, and in
 * dev that fetch is cross-origin — so the permission is offered, to the same one extra
 * origin the channel accepts and no other. A ranged fetch brings a preflight with it,
 * since `range` is not a safelisted request header, and it is answered before the token
 * is looked up: what a preflight asks is whether the method and header are allowed here
 * at all, which is true of every asset URL and of none that was revoked.
 */
async function serveAsset(
  request: IncomingMessage,
  response: ServerResponse,
  routes: Routes,
  token: string,
): Promise<void> {
  allowCrossOrigin(request, response, routes.pageOrigin, "accept-ranges, content-range");
  if (request.method === "OPTIONS") {
    answerPreflight(response, "GET, HEAD", "range");
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    refuseMethod(response, "GET, HEAD", "a served asset answers GET and HEAD");
    return;
  }
  const entry = routes.assets.lookup(token);
  if (entry === undefined) {
    routes.debug("asset: a request arrived for a URL that is not served");
    refuse(response, 404, "that asset is not being served: it was revoked, or never existed");
    return;
  }
  if (entry.kind === "stream") {
    serveAssetStream(request, response, entry, routes);
    return;
  }
  const size = entry.kind === "bytes" ? entry.bytes.byteLength : await fileSize(entry.path);
  if (size === undefined) {
    routes.debug("asset: the file behind a served URL is gone");
    refuse(response, 404, "the file behind this asset is not there any more");
    return;
  }
  const range = resolveRange(request.headers.range, size);
  if (range.kind === "unsatisfiable") {
    // The size goes back with the refusal, which is how a player that asked too far
    // learns what it may ask for instead.
    response.setHeader("content-range", `bytes */${String(size)}`);
    refuse(response, 416, "that byte range is outside this asset");
    return;
  }
  const start = range.kind === "partial" ? range.start : 0;
  const end = range.kind === "partial" ? range.end : size - 1;
  const length = Math.max(0, end - start + 1);
  response.writeHead(range.kind === "partial" ? 206 : 200, {
    "accept-ranges": "bytes",
    "cache-control": "no-store",
    "content-length": String(length),
    "content-type": assetContentType(entry),
    ...(range.kind === "partial" ? { "content-range": `bytes ${String(start)}-${String(end)}/${String(size)}` } : {}),
  });
  routes.debug(`asset: serving ${String(length)} bytes${range.kind === "partial" ? " of a range" : ""}`);
  if (request.method === "HEAD" || length === 0) {
    response.end();
    return;
  }
  if (entry.kind === "bytes") {
    response.end(entry.bytes.subarray(start, start + length));
    return;
  }
  send(createReadStream(entry.path, { start, end }), response);
}

/**
 * Serve a stream: once, whole, and without pretending it can seek.
 *
 * A stream has no length to declare and no way back to a byte it has passed, so
 * `accept-ranges: none` tells the browser not to try and a range asked for anyway
 * gets the whole body — which a server is entitled to answer. A second request finds
 * the bytes already read, and is told so rather than handed an empty body that would
 * look to a player like a corrupt file.
 */
function serveAssetStream(
  request: IncomingMessage,
  response: ServerResponse,
  entry: Extract<AssetEntry, { kind: "stream" }>,
  routes: Routes,
): void {
  const headers = {
    "accept-ranges": "none",
    "cache-control": "no-store",
    "content-type": assetContentType(entry),
  };
  if (request.method === "HEAD") {
    response.writeHead(200, headers);
    response.end();
    return;
  }
  if (entry.consumed) {
    refuse(response, 410, "this stream has already been read; serve a file if the page will ask twice");
    return;
  }
  entry.consumed = true;
  response.writeHead(200, headers);
  routes.debug("asset: streaming a source that can be read once");
  send(entry.stream, response);
}

/** What the entry says it is, what its path implies, or bytes. */
function assetContentType(entry: AssetEntry): string {
  if (entry.contentType !== undefined) {
    return entry.contentType;
  }
  return entry.kind === "file" ? (CONTENT_TYPES[extname(entry.path).toLowerCase()] ?? OCTET_STREAM) : OCTET_STREAM;
}

/** How big the file is, or `undefined` when there is no file there to serve. */
async function fileSize(path: string): Promise<number | undefined> {
  const found = await stat(path).catch(() => undefined);
  return found?.isFile() === true ? found.size : undefined;
}

async function servePageFile(
  request: IncomingMessage,
  response: ServerResponse,
  root: string,
  path: string,
): Promise<void> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    refuseMethod(response, "GET, HEAD", "the asset server answers GET and HEAD");
    return;
  }

  const file = resolveAsset(root, path);
  if (file === undefined) {
    refuse(response, 403, "that path is outside this extension's assets");
    return;
  }
  const found = await stat(file).catch(() => undefined);
  const target = found?.isDirectory() === true ? join(file, INDEX_FILE) : file;
  const meta = found?.isDirectory() === true ? await stat(target).catch(() => undefined) : found;
  if (meta?.isFile() !== true) {
    refuse(response, 404, "not found");
    return;
  }

  response.writeHead(200, {
    "cache-control": "no-store",
    "content-length": String(meta.size),
    "content-type": CONTENT_TYPES[extname(target).toLowerCase()] ?? OCTET_STREAM,
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  send(createReadStream(target), response);
}

/**
 * Stream a file's bytes out, surviving a file that stops being readable mid-flight.
 *
 * A file can vanish or lose its permissions between the stat above and the open here,
 * and `pipe` carries the read stream's failure nowhere: an unhandled `error` on a
 * stream is an uncaught exception, which would take the whole extension process down
 * over one bad asset. The headers are already sent by then, so there is no status left
 * to correct — the response is cut, and the browser reports the truncated body.
 *
 * The other direction matters too: a page that navigates away mid-download closes the
 * response, and the file handle would otherwise stay open.
 */
function send(file: Readable, response: ServerResponse): void {
  file.on("error", () => {
    response.destroy();
  });
  response.on("close", () => {
    file.destroy();
  });
  file.pipe(response);
}

/**
 * The requested path as a file under `root`, or `undefined` when it points outside.
 * Percent-escapes are decoded first, so `%2e%2e` is the same escape attempt as `..`
 * and is caught by the same check rather than sneaking past it.
 */
function resolveAsset(root: string, path: string): string | undefined {
  let decoded: string;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    return undefined;
  }
  if (decoded.includes("\0")) {
    return undefined;
  }
  const candidate = resolve(join(root, normalize(decoded)));
  return candidate === root || candidate.startsWith(root + sep) ? candidate : undefined;
}

/** Turn a request away, saying why in a body a developer will see in the console. */
function refuse(response: ServerResponse, status: number, reason: string): void {
  response.writeHead(status, { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" });
  response.end(reason);
}

/** Turn away a verb a route does not answer, naming the ones it does. */
function refuseMethod(response: ServerResponse, allowed: string, reason: string): void {
  response.setHeader("allow", allowed);
  refuse(response, 405, reason);
}
