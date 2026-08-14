import { getEventListeners } from "node:events";
import { describe, expect, it, vi } from "vitest";
import {
  CHANGE_METHOD_CAPABILITIES,
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
  connectOptions: {
    authToken?: string;
    requestedCapabilities?: readonly string[];
    onPrepareMove?: () => Promise<void> | void;
  } = {},
): Promise<{ connection: BridgeConnection; host: ScriptedHostPeer }> {
  const { client, host: hostTransport } = createTransportPair();
  const host = new ScriptedHostPeer(hostTransport, options);
  const connection = await connect({
    transport: client,
    authToken: connectOptions.authToken ?? "token-abc",
    requestedCapabilities: connectOptions.requestedCapabilities,
    onPrepareMove: connectOptions.onPrepareMove,
  });
  return { connection, host };
}

describe("the session wire", () => {
  it("is the one the schema declares", () => {
    // The harness spells the host's method names by hand, as the host does.
    // This is what keeps that spelling from drifting from the generated surface.
    const { changed, ...session } = HOST_METHODS;
    expect(Object.keys(SESSION_METHOD_CAPABILITIES).sort()).toEqual([...Object.values(session)].sort());

    // The change notification cannot be checked the same way: it is payload-gated,
    // so there is no capability row anywhere to compare its name against. What pins
    // its spelling is the delivery round trip in bindings.test.ts — the harness
    // sends this name and the generated client subscribes to its own, so a
    // disagreement is a change that never arrives.
    expect(Object.keys(CHANGE_METHOD_CAPABILITIES)).toEqual([]);
    expect(changed).toBe("state.changed");
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
    expect(connection.grant.provenance.granted).toEqual(["track.read", "track.write"]);
    expect(connection.protocolVersion).toBe(PROTOCOL_VERSION);
    connection.close();
  });

  it("carries the requested capability names into the handshake", async () => {
    // Tokens, not a `surface.*` name: a Surface Profile is the ceiling a grant is
    // computed against and resolves in no request namespace, so nothing asks by one.
    const { connection, host } = await connectToScriptedHost({}, { requestedCapabilities: ["clip.write", "track.read"] });

    expect((await host.handshake).requestedCapabilities).toEqual(["clip.write", "track.read"]);
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

  it("fails the handshake when the host's answer omits the accepted protocol version", async () => {
    const { client, host: hostTransport } = createTransportPair();
    new ScriptedHostPeer(hostTransport, {
      handshakeResult: { grantedTokens: [], sessionId: "session-1" },
    });

    const error = await connect({ transport: client, authToken: "t" }).catch((reason: unknown) => reason);

    // HANDSHAKE_FAILED, not PROTOCOL_VERSION_MISMATCH: the host never named a
    // version, and defaulting the field would report a mismatch against a version
    // nobody claimed to speak.
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

  it("leaves no abort listener behind on a signal whose call succeeded", async () => {
    // One controller for a whole session is the normal shape, so it outlives every
    // call made under it. `once` only detaches a listener that fired, so a call that
    // simply succeeded has to take its own off — otherwise the signal accumulates a
    // listener, and the closure it holds, per call.
    const controller = new AbortController();
    for (let i = 0; i < 3; i += 1) {
      const { client, host } = createTransportPair();
      new ScriptedHostPeer(host, {});
      const connection = await connect({
        transport: client,
        authToken: "token-abc",
        signal: controller.signal,
      });
      connection.close();
    }

    expect(getEventListeners(controller.signal, "abort")).toHaveLength(0);
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

  it("acks the pre-move quiesce with no hook provided", async () => {
    // The handler is registered in `connect`, before an extension could have wired
    // anything up. A peer that holds nothing open needs no hook, and the host must
    // not be left waiting out its deadline for an answer nobody was going to send.
    const { connection, host } = await connectToScriptedHost();

    await expect(host.prepareMove()).resolves.toEqual({ ready: true });
    connection.close();
  });

  it("runs the onPrepareMove hook before it acks", async () => {
    // The ack is the host's licence to start copying, so it must not go out until
    // the hook has actually released what it holds. A hook that resolves late is
    // how a real quiesce behaves — flushing to disk is not instant.
    let release: (() => void) | undefined;
    let quiesced = false;
    const { connection, host } = await connectToScriptedHost(
      {},
      {
        onPrepareMove: async () =>
          new Promise<void>((resolve) => {
            release = () => {
              quiesced = true;
              resolve();
            };
          }),
      },
    );

    const answer = host.prepareMove();
    // The hook has been entered — the ack is waiting on it, not racing it.
    await vi.waitFor(() => {
      expect(release).toBeDefined();
    });
    expect(quiesced).toBe(false);

    release?.();
    await expect(answer).resolves.toEqual({ ready: true });
    expect(quiesced).toBe(true);
    connection.close();
  });

  it("faults the call when the onPrepareMove hook throws", async () => {
    // A throwing hook is a broken quiesce, not a considered refusal, so it travels
    // as a fault rather than as `ready: false`. The host reads both as unsafe to
    // copy and names which in its log, so nothing is lost by keeping them apart —
    // and a bug in a hook never reads as the peer deliberately declining.
    const { connection, host } = await connectToScriptedHost(
      {},
      {
        onPrepareMove: () => {
          throw new Error("a render is still writing to the project folder");
        },
      },
    );

    const fault = await host.prepareMove().catch((reason: unknown) => reason);

    expect(fault).toMatchObject({ code: -32603 });
    connection.close();
  });

  it("hands the relocated project folder to every listener", async () => {
    // The release half. The path is the payload that matters: a parked peer reopens
    // under whatever arrives, and on an abandoned move that is the folder it
    // already had — which is what makes an unchanged value a bare "carry on".
    const { connection, host } = await connectToScriptedHost();
    const seen: string[] = [];
    const unsubscribe = connection.onProjectRelocated((params) => {
      seen.push(params.projectFolder);
    });

    host.relocateProject({ projectFolder: "/Users/me/Music/Saved As.acep" });
    await vi.waitFor(() => {
      expect(seen).toEqual(["/Users/me/Music/Saved As.acep"]);
    });

    unsubscribe();
    host.relocateProject({ projectFolder: "/Users/me/Music/Elsewhere.acep" });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(seen).toEqual(["/Users/me/Music/Saved As.acep"]);
    connection.close();
  });
});
