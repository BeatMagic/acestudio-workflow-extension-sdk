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
 * Two things are deliberate. The listener binds to `127.0.0.1`, so nothing off this
 * machine can reach an extension's page or its channel. And the channel's routes are
 * refused when the request carries a foreign `Origin`, so a page the user happens to
 * have open elsewhere cannot drive somebody's extension from across the browser.
 */

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import type { Readable } from "node:stream";
import { ExtensionError } from "../errors.js";
import type { ChannelHub, EventSink } from "./channel.js";
import { CHANNEL_PATH, frameEvent, type CallRequest, type CallResponse, type EventMessage } from "./protocol.js";

/** The address family the server serves on, and the only one it will. */
const LOOPBACK_HOST = "127.0.0.1";

/** What a request body may be, past which it is not a channel call. */
const MAX_CALL_BYTES = 8 * 1024 * 1024;

/** The file a directory request serves. */
const INDEX_FILE = "index.html";

/**
 * Content types by extension. Deliberately short: it covers what a built web app
 * is made of, and anything else is served as bytes, which every browser handles by
 * asking rather than by guessing wrong.
 */
const CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/vnd.microsoft.icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
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
}

/**
 * A running loopback server: where it is, and how to stop it.
 *
 * @internal
 */
export interface UiServer {
  /** The URL the page is served from — what gets announced to ACE Studio. */
  readonly url: string;
  /** Stop listening and drop every connected page. */
  close(): Promise<void>;
}

/**
 * Serve `assetsDir` on loopback, with the channel's routes alongside it.
 *
 * The port is whatever the OS hands out: an extension has no business asking for a
 * fixed one, and the URL is announced rather than guessed at.
 *
 * @throws ExtensionError when the assets directory is missing — an extension that
 * declared a UI and shipped no files is a broken bundle, and finding out at startup
 * beats finding out from an empty window.
 *
 * @internal
 */
export async function serveUi(assetsDir: string, hub: ChannelHub): Promise<UiServer> {
  const root = resolve(assetsDir);
  await requireDirectory(root, assetsDir);

  const server = createServer((request, response) => {
    void route(request, response, root, hub);
  });
  const port = await listen(server);
  return {
    url: `http://${LOOPBACK_HOST}:${String(port)}/`,
    close: async () => {
      hub.detachAll();
      await new Promise<void>((done) => {
        // Sockets held open by an event stream would keep `close` waiting for as
        // long as the page stays on screen, so they are cut rather than drained.
        server.closeAllConnections();
        server.close(() => {
          done();
        });
      });
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

async function route(request: IncomingMessage, response: ServerResponse, root: string, hub: ChannelHub): Promise<void> {
  const path = requestPath(request);
  if (path === CHANNEL_PATH) {
    await serveChannel(request, response, hub);
    return;
  }
  await serveAsset(request, response, root, path);
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

async function serveChannel(request: IncomingMessage, response: ServerResponse, hub: ChannelHub): Promise<void> {
  if (!sameOrigin(request)) {
    refuse(response, 403, "the channel is reachable from this extension's own page only");
    return;
  }
  if (request.method === "GET") {
    streamEvents(request, response, hub);
    return;
  }
  if (request.method === "POST") {
    await answerCall(request, response, hub);
    return;
  }
  refuseMethod(response, "GET, POST", "the channel answers GET (events) and POST (calls)");
}

/**
 * Whether the request came from the page this server serves. A browser sends no
 * `Origin` on a same-origin `GET`, and sends one on every cross-origin request and
 * every `POST` — so the check is "absent, or ours", and a foreign page's fetch is
 * refused before it reaches a handler.
 *
 * This is not a defence against another program on the machine, which can send
 * whatever headers it likes. Loopback is the boundary there.
 */
function sameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin;
  if (origin === undefined) {
    return true;
  }
  const host = request.headers.host;
  return host !== undefined && origin === `http://${host}`;
}

function streamEvents(request: IncomingMessage, response: ServerResponse, hub: ChannelHub): void {
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
  const detach = hub.attach(sink);
  request.on("close", detach);
  response.on("close", detach);
}

async function answerCall(request: IncomingMessage, response: ServerResponse, hub: ChannelHub): Promise<void> {
  let call: CallRequest;
  try {
    call = parseCall(await readBody(request));
  } catch (error) {
    refuse(response, 400, error instanceof Error ? error.message : "unreadable call");
    return;
  }
  const answer: CallResponse = await hub.invoke(call);
  const body = JSON.stringify(answer);
  response.writeHead(200, { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" });
  response.end(body);
}

/**
 * A call is refused as malformed only when it is not a call at all. Whether the
 * *parameters* are right is the handler's business, and the protocol type is what
 * settles it before either side runs.
 */
function parseCall(body: string): CallRequest {
  const parsed: unknown = JSON.parse(body);
  const call = parsed as Partial<CallRequest> | null;
  if (typeof call?.id !== "number" || typeof call.name !== "string") {
    throw new Error("a channel call needs a numeric id and a call name");
  }
  return { id: call.id, name: call.name, ...(call.params === undefined ? {} : { params: call.params }) };
}

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = chunk as Buffer;
    size += buffer.byteLength;
    if (size > MAX_CALL_BYTES) {
      throw new Error("this call's body is larger than the channel accepts");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function serveAsset(
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
    "content-type": CONTENT_TYPES[extname(target).toLowerCase()] ?? "application/octet-stream",
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
