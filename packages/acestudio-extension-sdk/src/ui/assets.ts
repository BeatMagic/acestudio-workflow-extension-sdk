/**
 * `ctx.ui.serveAsset` — one more asset on the server the paved road is already running.
 *
 * @remarks
 * `ui: { assets }` declares the built page, which is every asset an extension has at
 * build time. This is the runtime other half: an extension that renders something —
 * a preview stem, a waveform image — has bytes its page needs and no route to put them
 * on, because on the paved road the SDK owns the server. So it takes one: the bytes go
 * up at an opaque URL, revocable, answering byte ranges, which is the whole of what
 * lets `<audio>` and `<video>` seek.
 *
 * It is deliberately not a media service. Nothing here decodes, converts, or inspects
 * anything — bytes go out as they came in, under whatever content type the caller named.
 * Reading and writing the *project's* audio is the capability surface's business, not
 * this module's.
 *
 * The URL's token is what guards it. There is no `Origin` check, deliberately: a browser
 * sends no `Origin` when an element loads a `src`, so a check here would refuse the page
 * it exists for while refusing nothing else. Loopback and an unguessable token are the
 * boundary, and revoking is how a URL stops working.
 */

import { randomBytes } from "node:crypto";
import type { Readable } from "node:stream";
import { ExtensionError } from "../errors.js";
import { ASSET_PATH } from "./protocol.js";

/** How many random bytes a served asset's token carries. */
const TOKEN_BYTES = 16;

/**
 * What {@link ExtensionUi.serveAsset} will serve.
 *
 * A path or a `Uint8Array` can be seeked inside, so both answer range requests in
 * full — which is what `<video>` and `<audio>` need. A `Readable` cannot: it is
 * served once, whole, and a range request for it gets the whole body. Point a media
 * element at a file when the user is going to scrub through it.
 *
 * @public
 */
export type AssetSource = string | Uint8Array | Readable;

/**
 * What {@link ExtensionUi.serveAsset} needs when the defaults are not right.
 *
 * @public
 */
export interface ServeAssetOptions {
  /**
   * The `content-type` to serve the bytes as. Inferred from a file path's extension
   * when it is one this SDK knows, and `application/octet-stream` otherwise — so
   * bytes and streams usually want this set.
   */
  readonly contentType?: string;
}

/**
 * A URL a page can read, for as long as it is not revoked.
 *
 * @public
 */
export interface ServedAsset {
  /**
   * The URL to hand the page — through a channel call's result, an event, anything.
   * Opaque: it says nothing about where the bytes came from, so a path on the user's
   * disk does not end up in a page's DOM.
   */
  readonly url: string;
  /**
   * Stop serving it. The URL stops resolving immediately; a transfer already in
   * flight is left to finish, because cutting a video mid-buffer to reclaim a token
   * helps nobody. A stream nobody read is closed, since serving it was the last thing
   * holding it open.
   *
   * Revoking twice is not an error. Every handle is revoked when the run ends.
   */
  revoke(): void;
}

/**
 * One served source, as the server needs it: what the bytes are, and what to call
 * them.
 *
 * @internal
 */
export type AssetEntry =
  | { readonly kind: "file"; readonly path: string; readonly contentType: string | undefined }
  | { readonly kind: "bytes"; readonly bytes: Uint8Array; readonly contentType: string | undefined }
  | { readonly kind: "stream"; readonly stream: Readable; readonly contentType: string | undefined; consumed: boolean };

/**
 * Every asset this extension has served at runtime.
 *
 * Owned by the run rather than by the server, so `ctx.ui.serveAsset` is the same thing
 * for the whole run and the server is what a URL happens to be reachable through.
 *
 * @internal
 */
export class AssetRegistry {
  private readonly entries = new Map<string, AssetEntry>();
  private base: string | undefined;
  private stopped = false;

  /** Say where the server that carries these URLs is listening. */
  publishAt(base: string): void {
    this.base = base;
  }

  /** What is at `token`, or `undefined` when it was revoked or never existed. */
  lookup(token: string): AssetEntry | undefined {
    return this.entries.get(token);
  }

  /**
   * Revoke everything and stop minting URLs — the server is going away.
   *
   * Forgetting where it was listening is the point of the second half: a URL handed out
   * afterwards would name a port nothing is on any more, and failing to serve is a
   * better answer than a link that silently does not resolve. Nothing legitimate is cut
   * off, since `deactivate` has already run by the time the server closes.
   */
  revokeAll(): void {
    for (const entry of this.entries.values()) {
      release(entry);
    }
    this.entries.clear();
    this.base = undefined;
    this.stopped = true;
  }

  /**
   * Serve `source` at a fresh opaque URL.
   *
   * @throws ExtensionError when this extension has no server to serve it from: these
   * URLs live on the paved road's loopback server, so an extension running its own
   * server already has the route it would need — or when the run has already stopped
   * serving, which is a different mistake and says so.
   */
  serve(source: AssetSource, options: ServeAssetOptions = {}): ServedAsset {
    const base = this.base;
    if (base === undefined) {
      throw this.stopped
        ? new ExtensionError("this run has stopped serving its page, so an asset served now could not be fetched")
        : new ExtensionError("this extension is not serving a page, so it has nowhere to serve an asset from", {
            hint: "declare `ui: { assets }` to take the paved road, or serve it from the server you run yourself",
          });
    }
    const token = randomBytes(TOKEN_BYTES).toString("hex");
    this.entries.set(token, entryFor(source, options.contentType));
    return {
      url: new URL(`${ASSET_PATH}${token}`, base).toString(),
      revoke: () => {
        const entry = this.entries.get(token);
        this.entries.delete(token);
        if (entry !== undefined) {
          release(entry);
        }
      },
    };
  }
}

/**
 * Let go of whatever an entry that is no longer served was holding.
 *
 * Only a stream holds anything: serving one hands it over, so once its URL is gone
 * nothing else is left to close it, and one that was never read still owns whatever it
 * was reading from — a descriptor, a socket, a child process's output. A stream already
 * going out is left alone, because a transfer in flight is finished rather than cut, and
 * it closes itself when it ends.
 */
function release(entry: AssetEntry): void {
  if (entry.kind === "stream" && !entry.consumed) {
    entry.stream.destroy();
  }
}

function entryFor(source: AssetSource, contentType: string | undefined): AssetEntry {
  if (typeof source === "string") {
    return { kind: "file", path: source, contentType };
  }
  if (source instanceof Uint8Array) {
    return { kind: "bytes", bytes: source, contentType };
  }
  return { kind: "stream", stream: source, contentType, consumed: false };
}

/**
 * What a request asked for: the whole thing, one span of it, or a span that is not
 * inside it.
 *
 * @internal
 */
export type RangeRequest =
  | { readonly kind: "whole" }
  | { readonly kind: "partial"; readonly start: number; readonly end: number }
  | { readonly kind: "unsatisfiable" };

/**
 * Read a `Range` header against a known size, with `end` inclusive as the header
 * spells it.
 *
 * Anything this does not answer — a unit other than bytes, several ranges at once —
 * comes back as `whole`, which is a server's prerogative and what every media
 * element handles. Multipart range responses are the alternative, and no media
 * element needs one.
 *
 * @internal
 */
export function resolveRange(header: string | undefined, size: number): RangeRequest {
  const spec = header?.trim().toLowerCase();
  if (spec === undefined || !spec.startsWith("bytes=")) {
    return { kind: "whole" };
  }
  const span = spec.slice("bytes=".length);
  if (span.includes(",")) {
    return { kind: "whole" };
  }
  const [from, to] = span.split("-", 2);
  if (from === undefined || to === undefined) {
    return { kind: "whole" };
  }
  // An empty size has no byte to name, so every range over it is outside it.
  if (size === 0) {
    return { kind: "unsatisfiable" };
  }
  if (from === "") {
    const suffix = digits(to);
    return suffix === undefined || suffix === 0
      ? { kind: "unsatisfiable" }
      : { kind: "partial", start: Math.max(0, size - suffix), end: size - 1 };
  }
  const start = digits(from);
  if (start === undefined || start >= size) {
    return { kind: "unsatisfiable" };
  }
  if (to === "") {
    return { kind: "partial", start, end: size - 1 };
  }
  const end = digits(to);
  if (end === undefined || end < start) {
    return { kind: "unsatisfiable" };
  }
  return { kind: "partial", start, end: Math.min(end, size - 1) };
}

/** A run of digits as a number, or `undefined` for anything else — a sign included. */
function digits(text: string): number | undefined {
  return /^\d+$/.test(text) ? Number(text) : undefined;
}
