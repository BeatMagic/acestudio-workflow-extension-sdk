/**
 * The gate that would have caught the `operation.invoke` skew.
 *
 * Every binding must reach the host under the name the surface table declares as
 * that operation's `wire`, and under no other name. The client and the host agree
 * about method names only because both are generated from the same IDL — nothing
 * at run time re-derives one from the other — so the agreement has to be asserted
 * somewhere, and this is that somewhere.
 *
 * It is written against the whole table rather than a sample. The skew it exists
 * to catch was uniform: the runtime funnelled all 151 operations through one
 * retired verb, so any single operation would have shown it, and a sample chosen
 * before the next refactor might not cover whatever that one moves.
 */

import { describe, expect, it } from "vitest";

import {
  connect,
  createTransportPair,
  isBridgeError,
  PUBLIC_SURFACE,
  type OperationDescriptor,
} from "@timedomain/acestudio-bridge-core";

// Reached by path: `domainKey` is @internal, and reaching the bindings the way a
// caller does means spelling the group name the way the runtime nested it.
import { domainKey } from "../src/bindings.js";

import { ScriptedHostPeer } from "./support/host-peer.js";

/** Every token the table names, so no call is refused before it reaches the wire. */
const EVERY_TOKEN = [...new Set(PUBLIC_SURFACE.operations.map((operation) => String(operation.capability)))].filter(
  (token) => token.length > 0,
);

/** The bound method for one operation, reached the way a caller reaches it. */
function boundMethod(client: Record<string, unknown>, operation: OperationDescriptor): (...args: unknown[]) => unknown {
  const group =
    operation.domain === "" ? client : (client[domainKey(operation.domain)] as Record<string, unknown> | undefined);
  const method = group?.[operation.method];
  if (typeof method !== "function") {
    throw new Error(`no binding for ${operation.path}`);
  }
  return method as (...args: unknown[]) => unknown;
}

describe("every binding calls the wire name its descriptor declares", () => {
  it("sends each operation as its own JSON-RPC method, across the whole surface", async () => {
    const { client: clientTransport, host: hostTransport } = createTransportPair();
    // Answers every operation the table carries, so the run is about which name
    // the SDK sent rather than about what any one operation replies.
    const host = new ScriptedHostPeer(hostTransport, {
      grantedTokens: EVERY_TOKEN,
      operations: Object.fromEntries(PUBLIC_SURFACE.operations.map((operation) => [operation.path, { data: {} }])),
    });
    const connection = await connect({ transport: clientTransport, authToken: "token-abc" });
    const client = connection.client as unknown as Record<string, unknown>;

    for (const operation of PUBLIC_SURFACE.operations) {
      // Job-class operations hand back a handle rather than the raw answer, and a
      // few results are read for a field; neither matters here. The assertion is
      // on what went out, so a rejection is as informative as a resolution.
      await Promise.resolve(boundMethod(client, operation)(operation.takesParams ? {} : undefined)).catch(() => {
        // swallowed on purpose — see above
      });
    }

    expect(host.invocations.map((invocation) => invocation.wire)).toEqual(
      PUBLIC_SURFACE.operations.map((operation) => operation.wire),
    );
    connection.close();
  });

  it("refuses a name the table does not carry, the way the host's dispatcher does", async () => {
    const { client: clientTransport, host: hostTransport } = createTransportPair();
    const host = new ScriptedHostPeer(hostTransport, { grantedTokens: EVERY_TOKEN });
    const connection = await connect({ transport: clientTransport, authToken: "token-abc" });

    // The retired invocation envelope, named explicitly: this is the exact call
    // the SDK used to make for every operation, and a host that still answered it
    // would let the skew back in unnoticed.
    const refusal = await connection.peer.request("operation.invoke", {}).catch((cause: unknown) => cause);

    expect(isBridgeError(refusal)).toBe(true);
    expect(host.invocations).toEqual([]);
    connection.close();
  });
});
