import { describe, expect, it } from "vitest";
import {
  connect,
  createTransportPair,
  isBridgeError,
  isCode,
  PROTOCOL_VERSION,
  SESSION_METHOD_CAPABILITIES,
  type BridgeConnection,
  type Transport,
} from "@timedomain/acestudio-bridge-core";
import { HOST_METHODS, ScriptedHostPeer, type ScriptedHostOptions } from "./support/host-peer.js";

/** Stand up a scripted host and connect to it over an in-memory transport pair. */
async function connectToScriptedHost(
  options: ScriptedHostOptions = {},
  connectOptions: { authToken?: string; requestedCapabilities?: readonly string[] } = {},
): Promise<{ connection: BridgeConnection; host: ScriptedHostPeer }> {
  const { client, host: hostTransport } = createTransportPair();
  const host = new ScriptedHostPeer(hostTransport, options);
  const connection = await connect({
    transport: client,
    authToken: connectOptions.authToken ?? "token-abc",
    requestedCapabilities: connectOptions.requestedCapabilities,
  });
  return { connection, host };
}

describe("the session wire", () => {
  it("is the one the schema declares", () => {
    // The harness spells the host's method names by hand, as the host does.
    // This is what keeps that spelling from drifting from the generated surface.
    expect(Object.keys(SESSION_METHOD_CAPABILITIES).sort()).toEqual([...Object.values(HOST_METHODS)].sort());
  });
});

describe("connect", () => {
  it("completes the canonical handshake and resolves a session-established peer", async () => {
    const { connection, host } = await connectToScriptedHost({
      grantedTokens: ["track.read", "track.write"],
      sessionId: "session-42",
    });

    const request = await host.handshake;
    expect(request.authToken).toBe("token-abc");
    expect(request.protocolVersion).toBe(PROTOCOL_VERSION);

    expect(connection.sessionId).toBe("session-42");
    expect(connection.grantedTokens).toEqual(["track.read", "track.write"]);
    expect(connection.protocolVersion).toBe(PROTOCOL_VERSION);
    connection.close();
  });

  it("carries the requested capability names into the handshake", async () => {
    const { connection, host } = await connectToScriptedHost(
      {},
      { requestedCapabilities: ["surface.extension-sdk.v1", "track.read"] },
    );

    expect((await host.handshake).requestedCapabilities).toEqual(["surface.extension-sdk.v1", "track.read"]);
    connection.close();
  });

  it("rejects a protocol major mismatch with a typed error naming both versions", async () => {
    const { client, host: hostTransport } = createTransportPair();
    new ScriptedHostPeer(hostTransport, { acceptedProtocolVersion: PROTOCOL_VERSION + 1 });

    const error = await connect({ transport: client, authToken: "t" }).catch((reason: unknown) => reason);

    expect(isCode(error, "PROTOCOL_VERSION_MISMATCH")).toBe(true);
    if (!isCode(error, "PROTOCOL_VERSION_MISMATCH")) {
      throw new Error("unreachable");
    }
    expect(error.details.expected).toBe(PROTOCOL_VERSION);
    expect(error.details.actual).toBe(PROTOCOL_VERSION + 1);
    expect(error.message).toContain(String(PROTOCOL_VERSION + 1));
  });

  it("fails the handshake when the host's answer is not a handshake response", async () => {
    const { client, host: hostTransport } = createTransportPair();
    new ScriptedHostPeer(hostTransport, { handshakeResult: { acceptedProtocolVersion: PROTOCOL_VERSION } });

    const error = await connect({ transport: client, authToken: "t" }).catch((reason: unknown) => reason);

    expect(isCode(error, "HANDSHAKE_FAILED")).toBe(true);
  });

  it("fails the handshake when the host refuses the auth token", async () => {
    const { client, host: hostTransport } = createTransportPair();
    new ScriptedHostPeer(hostTransport, { authToken: "expected" });

    const error = await connect({ transport: client, authToken: "wrong" }).catch((reason: unknown) => reason);

    expect(isBridgeError(error)).toBe(true);
    expect(String(error)).toContain("unauthorized");
  });

  it("closes the transport when the handshake fails", async () => {
    const { client, host: hostTransport } = createTransportPair();
    new ScriptedHostPeer(hostTransport, { acceptedProtocolVersion: PROTOCOL_VERSION + 1 });
    let closes = 0;
    const watched: Transport = {
      send: (message) => client.send(message),
      onMessage: (handler) => client.onMessage(handler),
      onClose: (handler) => client.onClose(handler),
      close: () => {
        closes++;
        client.close();
      },
    };

    await connect({ transport: watched, authToken: "t" }).catch(() => undefined);

    expect(closes).toBe(1);
  });

  it("fails the handshake when the transport drops before the response", async () => {
    const { client, host: hostTransport } = createTransportPair();
    const host = new ScriptedHostPeer(hostTransport);
    const pending = connect({ transport: client, authToken: "t" });
    host.close();

    const error = await pending.catch((reason: unknown) => reason);
    expect(isCode(error, "BRIDGE_UNREACHABLE")).toBe(true);
  });

  it("fails the handshake when it outruns the deadline", async () => {
    const { client } = createTransportPair();

    const error = await connect({ transport: client, authToken: "t", timeoutMs: 20 }).catch((reason: unknown) => reason);

    expect(isCode(error, "TIMEOUT")).toBe(true);
  });

  it("aborts the handshake when the caller's signal fires", async () => {
    const { client } = createTransportPair();
    const controller = new AbortController();
    const pending = connect({ transport: client, authToken: "t", signal: controller.signal });
    controller.abort();

    const error = await pending.catch((reason: unknown) => reason);
    expect(isCode(error, "TIMEOUT")).toBe(true);
  });

  it("notifies close listeners when the host drops the connection", async () => {
    const { connection, host } = await connectToScriptedHost();
    const closed = new Promise<void>((resolve) => connection.onClose(resolve));
    host.close();
    await expect(closed).resolves.toBeUndefined();
  });
});

describe("the core-served session verbs", () => {
  it("answers the liveness ping with the nonce the host sent", async () => {
    const { connection, host } = await connectToScriptedHost();
    await expect(host.ping("nonce-9")).resolves.toBe("nonce-9");
    connection.close();
  });

  it("surfaces the shutdown notice with its reason and grace window", async () => {
    const { connection, host } = await connectToScriptedHost();
    const notice = new Promise<{ reason: string; graceMs: number }>((resolve) => connection.onShutdown(resolve));

    host.notifyShutdown({ reason: "project-closed", graceMs: 3000 });

    await expect(notice).resolves.toEqual({ reason: "project-closed", graceMs: 3000 });
    connection.close();
  });

  it("answers an unserved method with the JSON-RPC method-not-found fault", async () => {
    const { connection, host } = await connectToScriptedHost();

    const fault = await host.request("session.nothingServesThis").catch((reason: unknown) => reason);

    expect(fault).toMatchObject({ code: -32601 });
    connection.close();
  });
});
