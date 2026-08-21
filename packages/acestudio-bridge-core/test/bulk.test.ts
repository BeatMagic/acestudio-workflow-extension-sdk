/**
 * The bulk-data pass: typed arrays out of a binding, base64 into the wire, and
 * the `count × sizeof(dtype)` reject that makes the decode safe.
 *
 * The site tables are fixtures. Every operation the catalog carries today is
 * scalar — the curve group that motivated the bulk encoding has not reached it
 * — so the generated tables are empty, and a pass nothing exercises is one
 * nobody would notice failing. The wiring half of the file drives the real
 * binding stack against the scripted host with those fixture tables handed in.
 */

import { describe, expect, it } from "vitest";
import {
  connect,
  createTransportPair,
  DTYPE_BYTES,
  isCode,
  type BulkBlob,
  type BulkFieldDescriptor,
  type Dtype,
  type OperationDescriptor,
} from "@timedomain/acestudio-bridge-core";
// Reached by path: the pass and its table seam are @internal, and the generated
// tables have no rows to drive them with.
import { buildBindings, invocation } from "../src/bindings.js";
import { PUBLIC_SURFACE, type DriverSurface } from "../src/generated/bindings.js";
import { decodeBulkFields, encodeBulkFields } from "../src/bulk.js";
import { ScriptedHostPeer, type ScriptedHostOptions } from "./support/host-peer.js";

/**
 * Assert `call` refuses under a particular canonical code, for a reason its
 * message states. Both halves matter: the code is what a caller branches on, the
 * message is what a human reads.
 */
function refuses(call: () => unknown, code: "INVALID_ARG" | "MALFORMED_PAYLOAD", reason: RegExp): void {
  let caught: unknown;
  let returned = false;
  try {
    call();
    returned = true;
  } catch (error) {
    caught = error;
  }
  // Called once, so a helper reused by a test with side effects still describes
  // one invocation.
  expect(returned, "the call was expected to throw, and returned").toBe(false);
  expect(caught).toBeInstanceOf(Error);
  expect((caught as Error).message).toMatch(reason);
  expect(isCode(caught, code)).toBe(true);
}

/** One site at the root of an arguments or result object. */
const at = (field: string, dtype: Dtype | null = null): BulkFieldDescriptor[] => [{ field, dtype }];

/**
 * The wire envelope carrying `bytes` and claiming `count` elements. `count` is a
 * parameter rather than derived, so a test can stage the mismatch the decode
 * exists to reject.
 */
function blob(dtype: Dtype, bytes: Uint8Array, count: number): BulkBlob {
  return { dtype, count, data: btoa(String.fromCharCode(...bytes)) };
}

describe("encoding a typed array for the wire", () => {
  it("carries the element type, the count, and the little-endian bytes", () => {
    const encoded = encodeBulkFields(at("points", "f64le"), { points: new Float64Array([1, -2.5]) });

    // Little-endian is pinned in the contract, so the bytes are checkable
    // literals rather than whatever this platform happens to produce.
    expect(encoded).toEqual({
      points: blob("f64le", new Uint8Array(new Float64Array([1, -2.5]).buffer), 2),
    });
  });

  it("infers the dtype from the array when the schema leaves it open", () => {
    const encoded = encodeBulkFields(at("points"), { points: new Int32Array([7, 8, 9]) }) as {
      points: BulkBlob;
    };
    expect(encoded.points.dtype).toBe("i32le");
    expect(encoded.points.count).toBe(3);
  });

  it("refuses an array of the wrong element type for a pinned dtype", () => {
    // A Float32Array where the schema says f64le would reach the host as a blob
    // half the expected size — and `count` would agree with the bytes, so the
    // far side could not tell.
    refuses(
      () => encodeBulkFields(at("points", "f64le"), { points: new Float32Array([1, 2]) }),
      "INVALID_ARG",
      /expected a f64le array, got f32le/,
    );
  });

  it("refuses a plain array where a typed one belongs", () => {
    expect(() => encodeBulkFields(at("points", "f64le"), { points: [1, 2, 3] })).toThrowError(
      /expected a typed array, got an array/,
    );
  });

  it("leaves the caller's own object alone", () => {
    // A params object belongs to the caller, who may well call twice with it.
    const points = new Float64Array([1, 2]);
    const params = { layer: "dyn", points };
    const encoded = encodeBulkFields(at("points", "f64le"), params);

    expect(params.points).toBe(points);
    expect(encoded).not.toBe(params);
    expect((encoded as { layer: string }).layer).toBe("dyn");
  });
});

describe("decoding a wire envelope", () => {
  it("round-trips every dtype the contract declares", () => {
    // Walking DTYPE_BYTES rather than a hand-list: a new dtype in the generated
    // table has to appear here, which is what keeps the runtime constructor
    // table from falling behind the type-level one.
    for (const dtype of Object.keys(DTYPE_BYTES) as Dtype[]) {
      const sites = at("points", dtype);
      const original = dtype === "i64le" ? new BigInt64Array([1n, -2n, 3n]) : sampleArray(dtype);
      const encoded = encodeBulkFields(sites, { points: original });
      const decoded = decodeBulkFields(sites, encoded) as { points: ArrayLike<unknown> };

      expect(decoded.points).toEqual(original);
      expect(decoded.points.constructor).toBe(original.constructor);
    }
  });

  it("hard-rejects a blob whose bytes do not come to count × sizeof(dtype)", () => {
    // Truncation is the failure this check exists for: three doubles claimed,
    // two delivered. Decoding it would hand back a short Float64Array that reads
    // as a complete curve.
    const truncated: BulkBlob = {
      ...blob("f64le", new Uint8Array(new Float64Array([1, 2]).buffer), 3),
    };

    refuses(
      () => decodeBulkFields(at("points", "f64le"), { points: truncated }),
      "MALFORMED_PAYLOAD",
      /3 × 8-byte f64le is 24 bytes, but the payload decoded to 16/,
    );
  });

  it("rejects an over-long blob too, not just a short one", () => {
    const overlong = blob("f64le", new Uint8Array(new Float64Array([1, 2, 3]).buffer), 2);
    expect(() => decodeBulkFields(at("points", "f64le"), { points: overlong })).toThrowError(
      /is 16 bytes, but the payload decoded to 24/,
    );
  });

  it("rejects a count that is not a whole number of elements", () => {
    // The size check alone would pass this: 1.5 × 8 is 12, and the payload really
    // is 12 bytes. What it is not is a whole number of doubles, and the view
    // constructor says so with a bare RangeError — so the count is checked as a
    // count first, and the caller still gets a MALFORMED_PAYLOAD to branch on.
    refuses(
      () => decodeBulkFields(at("points", "f64le"), { points: blob("f64le", new Uint8Array(12), 1.5) }),
      "MALFORMED_PAYLOAD",
      /count 1.5 is not a whole number of elements/,
    );
    refuses(
      () => decodeBulkFields(at("points", "f64le"), { points: blob("f64le", new Uint8Array(8), -1) }),
      "MALFORMED_PAYLOAD",
      /count -1 is not a whole number of elements/,
    );
  });

  it("rejects a dtype the schema did not declare, and one nobody declares", () => {
    const wrong = blob("f32le", new Uint8Array(new Float32Array([1, 2]).buffer), 2);
    expect(() => decodeBulkFields(at("points", "f64le"), { points: wrong })).toThrowError(
      /expected dtype f64le, got f32le/,
    );
    expect(() => decodeBulkFields(at("points"), { points: { ...wrong, dtype: "f128be" } })).toThrowError(
      /unknown dtype "f128be"/,
    );
  });

  it("rejects a value that is not an envelope at all", () => {
    for (const notABlob of [null, 42, [1, 2, 3], { dtype: "f64le", count: 2 }]) {
      expect(() => decodeBulkFields(at("points", "f64le"), { points: notABlob })).toThrowError(/envelope/);
    }
  });

  it("rejects a payload that is not base64", () => {
    const garbage = { dtype: "f64le", count: 1, data: "not base64!!" };
    expect(() => decodeBulkFields(at("points", "f64le"), { points: garbage })).toThrowError(/not valid base64/);
  });
});

describe("where the sites sit", () => {
  it("reaches a field nested through an array", () => {
    const sites: BulkFieldDescriptor[] = [{ field: "layers[].points", dtype: "f32le" }];
    const original = { layers: [{ id: "a", points: new Float32Array([1]) }, { id: "b", points: new Float32Array([2, 3]) }] };

    const encoded = encodeBulkFields(sites, original) as { layers: { id: string; points: BulkBlob }[] };
    expect(encoded.layers.map((layer) => layer.points.count)).toEqual([1, 2]);
    expect(encoded.layers[0]?.id).toBe("a");

    expect(decodeBulkFields(sites, encoded)).toEqual(original);
  });

  it("leaves an absent optional field and an empty array alone", () => {
    // The tables describe the schema, which names every field an operation may
    // carry — not the ones one call did.
    const sites: BulkFieldDescriptor[] = [
      { field: "points", dtype: "f64le" },
      { field: "layers[].points", dtype: "f64le" },
    ];
    for (const payload of [{}, { layers: [] }, { layers: [{ id: "a" }] }]) {
      expect(encodeBulkFields(sites, payload)).toEqual(payload);
      expect(decodeBulkFields(sites, payload)).toEqual(payload);
    }
  });

  it("is a no-op for an operation with no sites", () => {
    const params = { trackIndex: 0 };
    expect(encodeBulkFields(undefined, params)).toBe(params);
    expect(encodeBulkFields([], params)).toBe(params);
    expect(decodeBulkFields(undefined, params)).toBe(params);
  });
});

describe("the pass inside a binding", () => {
  /**
   * A client over an established session, with fixture bulk tables in place of
   * the empty generated ones. Real peer, real grant, real scripted host —
   * everything but the tables is the shipping stack.
   */
  async function clientWithBulkTables(bulk: DriverSurface["bulk"], options: ScriptedHostOptions) {
    const { client: clientTransport, host: hostTransport } = createTransportPair();
    const host = new ScriptedHostPeer(hostTransport, options);
    const connection = await connect({ transport: clientTransport, authToken: "token-abc" });
    const client = buildBindings(connection.peer, connection.grant, () => {}, () => undefined, { ...PUBLIC_SURFACE, bulk }) as {
      transport: { setLoop(params: unknown, options?: unknown): Promise<unknown> };
      track: { list(options?: unknown): Promise<unknown> };
    };
    return { client, host, connection };
  }

  it("sends a typed argument as the envelope, never the array", async () => {
    const { client, host, connection } = await clientWithBulkTables(
      { params: { "transport set-loop": at("startTick", "f64le") }, result: {} },
      { grantedTokens: ["transport.control"], operations: { "transport set-loop": { data: {} } } },
    );

    await client.transport.setLoop({ startTick: new Float64Array([480, 960]) });

    expect(host.invocations[0]?.arguments).toEqual({
      startTick: blob("f64le", new Uint8Array(new Float64Array([480, 960]).buffer), 2),
    });
    connection.close();
  });

  it("pins base64 on an operation that declares the encoding, and sends no key on one that does not", () => {
    // `bulkEncoding` is descriptor data, and no catalog operation carries it
    // today, so this shapes the invocation directly rather than through a client
    // built from the generated table.
    const declared: OperationDescriptor = {
      path: "curve write",
      wire: "curve.write",
      domain: "curve",
      method: "write",
      capability: "curve.write",
      ungated: false,
      mutating: true,
      fingerprintPrecondition: false,
      takesParams: true,
      bulkEncoding: "base64",
    };
    const points = new Float64Array([0.5]);
    const sites = at("points", "f64le");

    expect(invocation(declared, { points }, {}, sites).arguments).toEqual({
      points: blob("f64le", new Uint8Array(points.buffer), 1),
      // The one argument the caller did not supply: the SDK always speaks
      // base64, so the choice is never theirs to make.
      encoding: "base64",
    });

    const { bulkEncoding: _omitted, ...undeclared } = declared;
    expect(invocation(undeclared, { points }, {}, sites).arguments).toEqual({
      points: blob("f64le", new Uint8Array(points.buffer), 1),
    });
  });

  it("hands a caller the decoded typed array, and the reject when it cannot", async () => {
    const points = new Float64Array([0.25, 0.5, 0.75]);
    const good = blob("f64le", new Uint8Array(points.buffer), 3);
    const { client, connection } = await clientWithBulkTables(
      { params: {}, result: { "track list": at("points", "f64le") } },
      { grantedTokens: ["track.read"], operations: { "track list": { data: { points: good } } } },
    );

    await expect(client.track.list()).resolves.toEqual({ points });
    connection.close();

    const { client: strict, connection: second } = await clientWithBulkTables(
      { params: {}, result: { "track list": at("points", "f64le") } },
      {
        grantedTokens: ["track.read"],
        operations: { "track list": { data: { points: { ...good, count: 4 } } } },
      },
    );

    // The reject happens inside the binding, so the caller never sees the short
    // array — they see a refusal naming the arithmetic that failed.
    await expect(strict.track.list()).rejects.toThrowError(/is 32 bytes, but the payload decoded to 24/);
    second.close();
  });
});

/** Three elements of `dtype`, for the round-trip walk. `i64le` needs BigInts and is built by the caller. */
function sampleArray(dtype: Exclude<Dtype, "i64le">): Uint8Array | Int16Array | Int32Array | Float32Array | Float64Array {
  const values = [1, 2, 3];
  switch (dtype) {
    case "u8":
      return new Uint8Array(values);
    case "i16le":
      return new Int16Array(values);
    case "i32le":
      return new Int32Array(values);
    case "f32le":
      return new Float32Array([0.5, 1.5, 2.5]);
    case "f64le":
      return new Float64Array([0.1, 0.2, 0.3]);
  }
}
