import { describe, expect, it } from "vitest";
import {
  connect,
  createTransportPair,
  isBridgeError,
  isCode,
  SURFACE_VERSION,
  type BridgeConnection,
} from "@timedomain/acestudio-bridge-core";
import { fail, ok, ScriptedHostPeer, type ScriptedHostOptions } from "./support/host-peer";

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

describe("connect", () => {
  it("completes the canonical handshake and resolves a session-established peer", async () => {
    const { connection, host } = await connectToScriptedHost({
      grantedTokens: ["track.read", "track.write"],
      sessionId: "session-42",
      appVersion: "3.1.0",
    });

    const hello = await host.hello;
    expect(hello.token).toBe("token-abc");
    expect(hello.protocolVersion).toBe(5);

    expect(connection.sessionId).toBe("session-42");
    expect(connection.grantedTokens).toEqual(["track.read", "track.write"]);
    expect(connection.appVersion).toBe("3.1.0");
    expect(connection.surfaceVersion).toBe("2.0");
    connection.close();
  });

  it("carries the requested capability names into the handshake", async () => {
    const { connection, host } = await connectToScriptedHost(
      {},
      { requestedCapabilities: ["surface.extension.v1", "track.read"] },
    );

    expect((await host.hello).requestedCapabilities).toEqual(["surface.extension.v1", "track.read"]);
    connection.close();
  });

  it("rejects a surface major mismatch with a typed error naming both versions", async () => {
    const { client, host: hostTransport } = createTransportPair();
    new ScriptedHostPeer(hostTransport, { surfaceVersion: "3.0" });

    const error = await connect({ transport: client, authToken: "t" }).catch((reason: unknown) => reason);

    expect(isCode(error, "SURFACE_VERSION_MISMATCH")).toBe(true);
    if (!isCode(error, "SURFACE_VERSION_MISMATCH")) {
      throw new Error("unreachable");
    }
    expect(error.details.expected).toBe(SURFACE_VERSION);
    expect(error.details.actual).toBe("3.0");
    expect(error.message).toContain(SURFACE_VERSION);
    expect(error.message).toContain("3.0");
  });

  it("accepts minor surface drift under the tolerant-reader rule", async () => {
    const { connection } = await connectToScriptedHost({ surfaceVersion: "2.7" });
    expect(connection.surfaceVersion).toBe("2.7");
    connection.close();
  });

  it("accepts a host that predates the surface-version field", async () => {
    const { connection } = await connectToScriptedHost({ surfaceVersion: "" });
    expect(connection.surfaceVersion).toBe("");
    connection.close();
  });

  it("fails the handshake when the host refuses the auth token", async () => {
    const { client, host: hostTransport } = createTransportPair();
    new ScriptedHostPeer(hostTransport, { authToken: "expected" });

    const error = await connect({ transport: client, authToken: "wrong" }).catch((reason: unknown) => reason);

    expect(isCode(error, "HANDSHAKE_FAILED")).toBe(true);
    expect(String(error)).toContain("unauthorized");
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

  it("auto-serves the liveness ping", async () => {
    const { connection, host } = await connectToScriptedHost();
    await expect(host.ping("nonce-9")).resolves.toBe("nonce-9");
    connection.close();
  });

  it("notifies close listeners when the host drops the connection", async () => {
    const { connection, host } = await connectToScriptedHost();
    const closed = new Promise<void>((resolve) => connection.onClose(resolve));
    host.close();
    await expect(closed).resolves.toBeUndefined();
  });
});

describe("invoke", () => {
  it("unwraps the command-result envelope's data", async () => {
    const { connection } = await connectToScriptedHost({
      commands: { "track list": () => ok({ tracks: [{ id: "t1" }] }) },
    });

    await expect(connection.invoke("track list")).resolves.toEqual({ tracks: [{ id: "t1" }] });
    connection.close();
  });

  it("passes arguments and the busy-gate wait through to the host", async () => {
    const { connection, host } = await connectToScriptedHost({
      commands: { "track rename": () => ok({}) },
    });

    await connection.invoke("track rename", { trackId: "t1", name: "Lead" }, { waitBusy: 2000 });

    expect(host.invocations).toEqual([
      { path: "track rename", arguments: { trackId: "t1", name: "Lead" }, waitTimeoutMs: 2000 },
    ]);
    connection.close();
  });

  it("turns a refusal envelope into a typed BridgeError", async () => {
    const { connection } = await connectToScriptedHost({
      commands: {
        "track set": () =>
          fail("CAPABILITY_DENIED", "'track set' was refused", {
            details: { missing: "track.write" },
            hint: "reconnect with a grant including track.write",
          }),
      },
    });

    const error = await connection.invoke("track set").catch((reason: unknown) => reason);

    expect(isBridgeError(error)).toBe(true);
    expect(isCode(error, "CAPABILITY_DENIED")).toBe(true);
    if (!isBridgeError(error)) {
      throw new Error("unreachable");
    }
    expect(error.details).toEqual({ missing: "track.write" });
    expect(error.hint).toBe("reconnect with a grant including track.write");
    expect(error.message).toContain("'track set' was refused");
    connection.close();
  });

  it("fails in-flight calls when the transport drops", async () => {
    const { connection, host } = await connectToScriptedHost({
      commands: { "track list": () => new Promise<never>(() => {}) },
    });

    const pending = connection.invoke("track list");
    host.close();

    const error = await pending.catch((reason: unknown) => reason);
    expect(isCode(error, "BRIDGE_UNREACHABLE")).toBe(true);
  });

  it("fails a call that outruns its deadline", async () => {
    const { connection } = await connectToScriptedHost({
      commands: { "track list": () => new Promise<never>(() => {}) },
    });

    const error = await connection.invoke("track list", {}, { timeoutMs: 20 }).catch((reason: unknown) => reason);

    expect(isCode(error, "TIMEOUT")).toBe(true);
    connection.close();
  });
});
