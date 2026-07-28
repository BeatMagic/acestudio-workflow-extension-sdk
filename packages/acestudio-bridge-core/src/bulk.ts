/**
 * The bulk-data pass: typed arrays on the binding surface, base64 on the wire.
 *
 * @remarks
 * Bulk operations carry point data as a self-describing `{dtype, count, data}`
 * envelope (spec 1501 §8). A binding never shows that to a caller — it takes and
 * returns typed arrays, and the conversion happens here, driven by the generated
 * tables that say where in each operation's arguments and result the envelopes
 * sit (ADR 0094 §9).
 *
 * `count` is what makes the decode safe: a blob whose bytes do not come to
 * `count × sizeof(dtype)` is **rejected**, never truncated into a short array. A
 * caller that got a `Float64Array` back knows it is the whole curve, which is the
 * one guarantee worth having when the alternative is silently editing the first
 * half of something.
 */

import { BridgeError } from "./errors.js";
import { DTYPE_BYTES, type BulkBlob, type BulkFieldDescriptor, type Dtype } from "./generated/bindings.js";

/** Any of the typed-array views a `dtype` maps to. */
type BulkArray = Uint8Array | Int16Array | Int32Array | BigInt64Array | Float32Array | Float64Array;

/**
 * The typed-array constructor each `dtype` maps to. The generated `TypedArrayFor`
 * is the type-level half of this table; nothing but a test can keep the two in
 * step, so `bulk.test.ts` walks `DTYPE_BYTES` and asserts this covers it.
 */
const DTYPE_ARRAYS = {
  u8: Uint8Array,
  i16le: Int16Array,
  i32le: Int32Array,
  i64le: BigInt64Array,
  f32le: Float32Array,
  f64le: Float64Array,
} as const satisfies Readonly<Record<Dtype, new (buffer: ArrayBuffer) => BulkArray>>;

/**
 * The `dtype` a typed array is, or `undefined` for something that is not one.
 * Built by inverting the table above so a new `dtype` cannot be added to one
 * direction only.
 */
function dtypeOf(value: unknown): Dtype | undefined {
  for (const [dtype, ctor] of Object.entries(DTYPE_ARRAYS) as [Dtype, (typeof DTYPE_ARRAYS)[Dtype]][]) {
    if (value instanceof ctor) {
      return dtype;
    }
  }
  return undefined;
}

/**
 * Whether this platform stores multi-byte integers little-endian.
 *
 * Every `dtype` but `u8` pins little-endian in the contract, which is what lets
 * the decode be one base64 pass plus a typed-array view over the bytes — the
 * whole reason the bulk encoding exists. That view reads in platform order, so
 * the fast path is only correct on a little-endian platform. Every platform ACE
 * Studio ships on is one; a big-endian host gets a refusal below rather than
 * byte-swapped doubles that would read as plausible curve data.
 */
const LITTLE_ENDIAN = new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;

/** Larger than this many bytes per `btoa`/`atob` call risks the argument limit. */
const BASE64_CHUNK = 0x8000;

/**
 * One operation's bulk-field descriptors, or `undefined` for an operation with
 * none — which is nearly all of them. The generated tables are keyed by operation
 * path; a caller resolves the row and hands the descriptors here.
 *
 * @internal
 */
export type BulkSites = readonly BulkFieldDescriptor[] | undefined;

/**
 * Replace every typed array at `sites` with its wire envelope, returning a new
 * arguments object. The caller's object is never mutated: a params object is the
 * caller's own value, and a binding that rewrote it in place would hand back
 * something they cannot call twice.
 *
 * @internal
 */
export function encodeBulkFields(sites: BulkSites, params: unknown): unknown {
  return applySites(sites, params, encodeSite);
}

/**
 * Replace every wire envelope at `sites` with its typed array, returning a new
 * result object.
 *
 * @internal
 */
export function decodeBulkFields(sites: BulkSites, data: unknown): unknown {
  return applySites(sites, data, decodeSite);
}

/** Run `transform` over every site in turn, threading the rewritten root. */
function applySites(sites: BulkSites, root: unknown, transform: SiteTransform): unknown {
  if (sites === undefined || sites.length === 0) {
    return root;
  }
  let current = root;
  for (const site of sites) {
    current = rewrite(current, parseSite(site.field), 0, site, transform);
  }
  return current;
}

/** How one leaf value is converted, given the descriptor that named it. */
type SiteTransform = (value: unknown, site: BulkFieldDescriptor) => unknown;

/** One step of a site path: a named member, or "every element of this array". */
type Step = { readonly key: string } | { readonly each: true };

/**
 * Split a descriptor's `field` into steps. `[]` marks an array element, so
 * `layers[].points` is member `layers`, each element, member `points` — and
 * `[]` can repeat for a nested array.
 */
function parseSite(field: string): readonly Step[] {
  const steps: Step[] = [];
  for (const part of field.split(".")) {
    // Splitting on `[]` leaves the member name first and one empty string per
    // bracket pair after it, so the tail's length is the array depth.
    const [key, ...brackets] = part.split("[]");
    if (key !== "") {
      steps.push({ key });
    }
    for (let depth = 0; depth < brackets.length; depth++) {
      steps.push({ each: true });
    }
  }
  return steps;
}

/**
 * A copy of `node` with the value at `steps[index...]` transformed.
 *
 * A path that runs off the end of what is actually there — an absent optional
 * field, an empty array — leaves the node alone. The tables describe the schema,
 * and a schema names every field an operation *may* carry, not the ones one call
 * did.
 */
function rewrite(
  node: unknown,
  steps: readonly Step[],
  index: number,
  site: BulkFieldDescriptor,
  transform: SiteTransform,
): unknown {
  const step = steps[index];
  if (step === undefined) {
    return transform(node, site);
  }
  if ("each" in step) {
    return Array.isArray(node) ? node.map((element) => rewrite(element, steps, index + 1, site, transform)) : node;
  }
  if (node === null || typeof node !== "object") {
    return node;
  }
  const members = node as Record<string, unknown>;
  if (members[step.key] === undefined) {
    return node;
  }
  return { ...members, [step.key]: rewrite(members[step.key], steps, index + 1, site, transform) };
}

/** A typed array as the envelope the wire carries. */
function encodeSite(value: unknown, site: BulkFieldDescriptor): unknown {
  const dtype = dtypeOf(value);
  if (dtype === undefined) {
    throw malformedArgument(
      site,
      `expected a typed array, got ${describe(value)}`,
      "bulk fields take a typed array; the binding builds the wire envelope itself",
    );
  }
  // A pinned dtype is the operation's declared element type. Sending a
  // Float32Array where the schema says `f64le` would reach the host as a blob
  // half the expected size, so it is refused here with the reason attached.
  if (site.dtype !== null && site.dtype !== dtype) {
    throw malformedArgument(
      site,
      `expected a ${site.dtype} array, got ${dtype}`,
      `convert the data to ${site.dtype} before the call`,
    );
  }
  requireLittleEndian(dtype);
  const array = value as BulkArray;
  return {
    dtype,
    count: array.length,
    data: toBase64(new Uint8Array(array.buffer, array.byteOffset, array.byteLength)),
  } satisfies BulkBlob;
}

/** The envelope the wire carried as the typed array a caller reads. */
function decodeSite(value: unknown, site: BulkFieldDescriptor): unknown {
  const blob = value as Partial<BulkBlob> | null;
  if (blob === null || typeof blob !== "object" || typeof blob.data !== "string" || typeof blob.count !== "number") {
    throw malformedPayload(site, `expected a {dtype, count, data} envelope, got ${describe(value)}`);
  }
  const dtype = blob.dtype;
  if (dtype === undefined || !(dtype in DTYPE_ARRAYS)) {
    throw malformedPayload(site, `unknown dtype ${JSON.stringify(dtype)}`);
  }
  if (site.dtype !== null && site.dtype !== dtype) {
    throw malformedPayload(site, `expected dtype ${site.dtype}, got ${dtype}`);
  }
  requireLittleEndian(dtype);
  // `count` is a number by the check above, which is not yet a count. A
  // fractional one whose product happens to match the byte length would pass
  // the size check below and reach the view constructor, which rejects a buffer
  // that is not a whole number of elements with a bare `RangeError` — past this
  // module's promise that a bad payload arrives as `MALFORMED_PAYLOAD`.
  if (!Number.isSafeInteger(blob.count) || blob.count < 0) {
    throw malformedPayload(site, `count ${blob.count} is not a whole number of elements`);
  }

  const bytes = fromBase64(blob.data, site);
  // The `count` check, and the reason `count` is on the wire at all: a blob that
  // lost bytes in transit would otherwise decode into a short array that reads
  // as a complete curve.
  const expected = blob.count * DTYPE_BYTES[dtype];
  if (bytes.byteLength !== expected) {
    throw malformedPayload(
      site,
      `${blob.count} × ${DTYPE_BYTES[dtype]}-byte ${dtype} is ${expected} bytes, but the payload decoded to ${bytes.byteLength}`,
    );
  }
  return new DTYPE_ARRAYS[dtype](bytes);
}

/**
 * Refuse a multi-byte `dtype` on a platform the typed-array view would misread.
 * `u8` is exempt — a single byte has no order.
 */
function requireLittleEndian(dtype: Dtype): void {
  if (dtype === "u8" || LITTLE_ENDIAN) {
    return;
  }
  throw new BridgeError({
    code: "MALFORMED_PAYLOAD",
    message: `cannot read ${dtype} bulk data on a big-endian platform`,
    hint: "the bulk encoding pins little-endian; decode the base64 payload yourself with an explicit DataView",
  });
}

/**
 * Base64 of `bytes`, in chunks small enough for `btoa`'s argument limit.
 *
 * The chunks are joined once rather than appended to a running string: this is
 * the path built for payloads that are large by design, and one `join` does not
 * depend on the engine optimizing repeated concatenation.
 */
function toBase64(bytes: Uint8Array): string {
  const chunks: string[] = [];
  for (let at = 0; at < bytes.length; at += BASE64_CHUNK) {
    chunks.push(String.fromCharCode(...bytes.subarray(at, at + BASE64_CHUNK)));
  }
  return btoa(chunks.join(""));
}

/**
 * `data` as a buffer of exactly its own bytes — the view built over it needs
 * that: an element-sized byte offset, and a length that divides evenly. A
 * decoder is free to hand back a slice of a pooled buffer that satisfies
 * neither, so this allocates rather than borrowing.
 *
 * `btoa`/`atob` rather than `Buffer`: the same bindings serve an extension's
 * Node process and its browser-hosted UI page, and only these two are in both.
 */
function fromBase64(data: string, site: BulkFieldDescriptor): ArrayBuffer {
  let binary: string;
  try {
    binary = atob(data);
  } catch (cause) {
    throw malformedPayload(site, "the payload is not valid base64", cause);
  }
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let at = 0; at < binary.length; at++) {
    bytes[at] = binary.charCodeAt(at);
  }
  return buffer;
}

/** The caller handed a bulk field something that is not the array it declared. */
function malformedArgument(site: BulkFieldDescriptor, reason: string, hint: string): BridgeError<"INVALID_ARG"> {
  return new BridgeError({
    code: "INVALID_ARG",
    message: `bulk field '${site.field}': ${reason}`,
    hint,
  });
}

/**
 * The host's envelope does not match the operation's declared bulk contract. Not
 * the caller's fault, and not recoverable by retrying the same call.
 */
function malformedPayload(
  site: BulkFieldDescriptor,
  reason: string,
  cause?: unknown,
): BridgeError<"MALFORMED_PAYLOAD"> {
  return new BridgeError({
    code: "MALFORMED_PAYLOAD",
    message: `bulk field '${site.field}': ${reason}`,
    hint: "the host's payload does not match this operation's declared bulk contract; nothing was decoded",
    ...(cause === undefined ? {} : { cause }),
  });
}

/** What a value is, for a message that has to say why it was refused. */
function describe(value: unknown): string {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "an array";
  }
  return typeof value === "object" ? (value.constructor?.name ?? "an object") : typeof value;
}
