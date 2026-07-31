/**
 * Bytes on the channel: how a call carries them, in both directions.
 *
 * @remarks
 * A JSON channel cannot express an upload. Rather than hand extensions a raw route
 * to register — the untyped REST sprawl the platform retired — the channel itself
 * learns to carry bytes: a value inside a call's parameters or its result may be
 * binary, and it arrives on the other side as bytes rather than as a mangled object.
 *
 * One frame does it. A short header, the message as JSON with each binary value
 * lifted out and replaced by the index of its part, then the parts end to end:
 *
 * ```text
 * [4 bytes: JSON length, big-endian][JSON][part 0][part 1]…
 * ```
 *
 * A message with no bytes in it never enters that frame — it stays plain JSON, so
 * the ordinary call pays nothing for a feature it does not use.
 *
 * This module is imported by both the process side and the browser side, so it uses
 * only what both have: `Uint8Array`, `TextEncoder`/`TextDecoder`, `Blob`. No Node,
 * no DOM.
 */

/**
 * The content type a framed message travels under. Both ends read the header to decide
 * how to decode, so the spelling lives here rather than at either end.
 *
 * @internal
 */
export const BINARY_CONTENT_TYPE = "application/vnd.acestudio.channel+binary";

/**
 * The content type a message with no bytes in it travels under — which is most of them,
 * and the reason the framing above costs nothing when it is not needed.
 *
 * @internal
 */
export const JSON_CONTENT_TYPE = "application/json";

/**
 * The key a lifted part's placeholder is spelled with. Prefixed so an author's own
 * data cannot collide with it by accident.
 */
const PART_KEY = "__aceBytes";

/** The frame's fixed-size header: the JSON section's length. */
const HEADER_BYTES = 4;

/** What a JSON section may be, past which the frame is not one this SDK wrote. */
const MAX_JSON_BYTES = 8 * 1024 * 1024;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * A message ready to send: the body, and what to label it.
 *
 * @internal
 */
export interface EncodedMessage {
  readonly contentType: string;
  /**
   * The bytes to send. Pinned to a real `ArrayBuffer` rather than the wider
   * `ArrayBufferLike`, because that is what `fetch` accepts as a body — a view over a
   * `SharedArrayBuffer` is not something a request can carry.
   */
  readonly body: Uint8Array<ArrayBuffer>;
}

/**
 * Encode one call or answer, framing it only if it actually carries bytes.
 *
 * `Uint8Array`, any other typed-array view, an `ArrayBuffer`, and a `Blob` are all
 * carried; each arrives at the other end as a `Uint8Array`. Async because a `Blob`
 * only yields its bytes asynchronously, and a page's file input hands out `Blob`s.
 *
 * @internal
 */
export async function encodeMessage(message: unknown): Promise<EncodedMessage> {
  const parts: Uint8Array[] = [];
  const lifted = await lift(message, parts);
  if (parts.length === 0) {
    return { contentType: JSON_CONTENT_TYPE, body: encoder.encode(JSON.stringify(message)) };
  }
  const json = encoder.encode(JSON.stringify({ message: lifted, parts: parts.map((part) => part.byteLength) }));
  const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const body = new Uint8Array(HEADER_BYTES + json.byteLength + total);
  writeLength(body, json.byteLength);
  body.set(json, HEADER_BYTES);
  let offset = HEADER_BYTES + json.byteLength;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.byteLength;
  }
  return { contentType: BINARY_CONTENT_TYPE, body };
}

/**
 * Decode one call or answer, reading the content type to know which of the two
 * shapes arrived.
 *
 * @throws Error when the body is not the shape its content type claims. Both ends
 * turn that into a refusal — a 400 from the process, a thrown call from the page —
 * because a frame this cannot read is not a message either side can act on.
 *
 * @internal
 */
export function decodeMessage(contentType: string | undefined, body: Uint8Array): unknown {
  if (!isBinaryContentType(contentType)) {
    return JSON.parse(decoder.decode(body));
  }
  if (body.byteLength < HEADER_BYTES) {
    throw new Error("this binary channel frame is too short to hold its own header");
  }
  const jsonLength = readLength(body);
  if (jsonLength > MAX_JSON_BYTES || HEADER_BYTES + jsonLength > body.byteLength) {
    throw new Error("this binary channel frame's header does not describe its body");
  }
  const frame = JSON.parse(decoder.decode(body.subarray(HEADER_BYTES, HEADER_BYTES + jsonLength))) as {
    message?: unknown;
    parts?: unknown;
  };
  return drop(frame.message, readParts(body, HEADER_BYTES + jsonLength, frame.parts));
}

/**
 * Whether a content type is the framed one. Compared against the type alone: a
 * `fetch` may add parameters, and `application/…+binary; charset=x` is still the
 * frame it says it is.
 *
 * @internal
 */
export function isBinaryContentType(contentType: string | undefined): boolean {
  return contentType?.split(";")[0]?.trim().toLowerCase() === BINARY_CONTENT_TYPE;
}

/**
 * Whether anything in `value` is bytes. What the event stream checks before framing
 * a push: its framing is text, so bytes in an event would be silently stringified
 * into an object of numbered keys, and saying so is better than sending that.
 *
 * @internal
 */
export function hasBinary(value: unknown): boolean {
  if (isBinary(value)) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some(hasBinary);
  }
  return isPlainObject(value) && Object.values(value).some(hasBinary);
}

/**
 * Replace every binary value with a placeholder, collecting the bytes in order.
 *
 * Only arrays and plain objects are walked into. Anything else with a prototype of
 * its own — a `Date`, a `Map`, a class instance — is left alone, because what it
 * becomes on the wire is already decided by `JSON.stringify` and second-guessing
 * that here would change the meaning of messages that have nothing to do with bytes.
 */
async function lift(value: unknown, parts: Uint8Array[]): Promise<unknown> {
  const bytes = await asBytes(value);
  if (bytes !== undefined) {
    parts.push(bytes);
    return { [PART_KEY]: parts.length - 1 };
  }
  if (Array.isArray(value)) {
    const lifted: unknown[] = [];
    for (const element of value) {
      lifted.push(await lift(element, parts));
    }
    return lifted;
  }
  if (!isPlainObject(value)) {
    return value;
  }
  const lifted: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(value)) {
    lifted[key] = await lift(field, parts);
  }
  return lifted;
}

/** Put each part back where its placeholder is. */
function drop(value: unknown, parts: readonly Uint8Array[]): unknown {
  if (Array.isArray(value)) {
    return value.map((element) => drop(element, parts));
  }
  if (!isPlainObject(value)) {
    return value;
  }
  const index = value[PART_KEY];
  if (typeof index === "number" && Object.keys(value).length === 1) {
    const part = parts[index];
    if (part === undefined) {
      throw new Error("this binary channel frame refers to a part it does not carry");
    }
    return part;
  }
  const dropped: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(value)) {
    dropped[key] = drop(field, parts);
  }
  return dropped;
}

/**
 * The parts as views over the body. Views rather than copies: together they *are* the
 * rest of the body, so copying would double what an upload costs for nothing.
 *
 * Built as plain `Uint8Array`s rather than with `subarray`, which would hand back the
 * body's own class — and on the process side the body is a Node `Buffer`, whose
 * `JSON.stringify` is `{"type":"Buffer",…}`. Both ends promise a `Uint8Array` and both
 * ends deliver one.
 */
function readParts(body: Uint8Array, start: number, lengths: unknown): Uint8Array[] {
  if (!Array.isArray(lengths) || lengths.some((length) => typeof length !== "number" || length < 0)) {
    throw new Error("this binary channel frame does not say how long its parts are");
  }
  const parts: Uint8Array[] = [];
  let offset = start;
  for (const length of lengths as number[]) {
    if (offset + length > body.byteLength) {
      throw new Error("this binary channel frame is shorter than the parts it declares");
    }
    parts.push(new Uint8Array(body.buffer, body.byteOffset + offset, length));
    offset += length;
  }
  return parts;
}

/** The bytes of whatever binary `value` is, or `undefined` when it is not binary. */
async function asBytes(value: unknown): Promise<Uint8Array | undefined> {
  if (value instanceof Uint8Array) {
    return value;
  }
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  // Every other typed-array view and `DataView`: carried as the bytes they sit on,
  // so a `Float32Array` of samples is not quietly stringified into numbered keys.
  // What arrives is a `Uint8Array` over those bytes; a receiver that wants the
  // typed view back re-wraps it.
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (isBlob(value)) {
    return new Uint8Array(await value.arrayBuffer());
  }
  return undefined;
}

/** The synchronous half of {@link asBytes}, for the check that only asks whether. */
function isBinary(value: unknown): boolean {
  return value instanceof ArrayBuffer || ArrayBuffer.isView(value) || isBlob(value);
}

function isBlob(value: unknown): value is Blob {
  return typeof Blob !== "undefined" && value instanceof Blob;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
}

function writeLength(body: Uint8Array, length: number): void {
  body[0] = (length >>> 24) & 0xff;
  body[1] = (length >>> 16) & 0xff;
  body[2] = (length >>> 8) & 0xff;
  body[3] = length & 0xff;
}

/** Unsigned, so a high bit in the first byte is a big length rather than a negative one. */
function readLength(body: Uint8Array): number {
  return (
    (((body[0] as number) << 24) | ((body[1] as number) << 16) | ((body[2] as number) << 8) | (body[3] as number)) >>> 0
  );
}
