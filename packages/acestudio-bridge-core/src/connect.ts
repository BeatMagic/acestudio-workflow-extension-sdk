/**
 * `connect()` — the one way into a running ACE Studio.
 *
 * @remarks
 * The handshake happens before the promise resolves, so a
 * {@link BridgeConnection} is always a granted, session-established peer:
 * there is no half-open state to check for. Options are explicit values only —
 * reading a socket path and a one-time token out of the spawn environment
 * belongs to the layer above, which knows what spawned it.
 *
 * Every wire name and payload here comes from the generated session surface, so
 * this file cannot disagree with the host about what the handshake looks like.
 */

import { BridgeError } from "./errors.js";
import {
  SessionClient,
  type HandshakeParams,
  type HandshakeResult,
  type PingParams,
  type PingResult,
  type ShutdownParams,
} from "./generated/Session.acerpc.js";
import { BridgePeer } from "./peer.js";
import { PROTOCOL_VERSION } from "./protocol.js";
import type { Transport, Unsubscribe } from "./transport.js";

/** How long the handshake waits for the host, when the caller sets no deadline. */
const DEFAULT_HANDSHAKE_TIMEOUT_MS = 10_000;

/** The liveness method core answers on the host's behalf. */
const SESSION_PING = "session.ping";

/**
 * What {@link connect} needs to open a session.
 *
 * @public
 */
export interface ConnectOptions {
  /** The message port to speak over. */
  transport: Transport;
  /** The one-time session token the host minted for this process. */
  authToken: string;
  /**
   * Capability names to request. The extension host ignores them — an
   * extension's grant is the consent record from install — so this is for the
   * drivers that do resolve a request against the registry.
   */
  requestedCapabilities?: readonly string[];
  /** Deadline for the handshake, in milliseconds. */
  timeoutMs?: number;
  /** Abort the handshake. */
  signal?: AbortSignal;
}

/**
 * An open, granted session against a running ACE Studio.
 *
 * @public
 */
export interface BridgeConnection {
  /** The session id the host minted. */
  readonly sessionId: string;
  /** The session's grant, as flat canonical token names. */
  readonly grantedTokens: readonly string[];
  /**
   * The bridge protocol version the host accepted. Informational: it matched
   * ours or {@link connect} would have refused the session.
   */
  readonly protocolVersion: number;
  /**
   * The JSON-RPC peer underneath: the generated bindings ride it, and it is how
   * to call or subscribe to anything they do not cover.
   */
  readonly peer: BridgePeer;
  /**
   * Called when the host announces it is stopping this peer, ahead of its
   * grace window. Running `deactivate` and exiting in time is the extension
   * layer's job; core only surfaces the notice.
   */
  onShutdown(listener: (params: ShutdownParams) => void): Unsubscribe;
  /** Listen for the connection dropping. */
  onClose(listener: () => void): Unsubscribe;
  /** Close the connection, failing every call in flight. */
  close(): void;
}

/**
 * Open a session against a running ACE Studio: run the canonical handshake
 * over `transport` and resolve once the host has granted a session.
 *
 * @throws BridgeError with code `HANDSHAKE_FAILED` if the host refuses,
 * `PROTOCOL_VERSION_MISMATCH` on a wire-major skew, `BRIDGE_UNREACHABLE` if the
 * transport drops, or `TIMEOUT` if the handshake outruns its deadline.
 *
 * @public
 */
export async function connect(options: ConnectOptions): Promise<BridgeConnection> {
  const peer = new BridgePeer(options.transport);
  // Served before the handshake goes out: the host starts probing as soon as the
  // session lands. The nonce comes straight back so it can correlate.
  peer.setRequestHandler(SESSION_PING, (params) => ({
    nonce: (params as PingParams | undefined)?.nonce ?? "",
  }) satisfies PingResult);

  const client = new SessionClient(peer);
  const request: HandshakeParams = {
    authToken: options.authToken,
    protocolVersion: PROTOCOL_VERSION,
    // Copied rather than cast. The generated wire type is mutable and the caller's
    // array is the caller's, so a cast would both lie about the type and hand our
    // serializer something it could write through.
    requestedCapabilities:
      options.requestedCapabilities === undefined ? undefined : [...options.requestedCapabilities],
  };

  try {
    const answer = await peer.withDeadline(
      { timeoutMs: options.timeoutMs ?? DEFAULT_HANDSHAKE_TIMEOUT_MS, signal: options.signal },
      () => client.sessionHandshake(request),
    );
    const result = readHandshakeResult(answer);
    const mismatch = protocolMismatch(result);
    if (mismatch !== undefined) {
      throw mismatch;
    }
    return new Connection(peer, client, result);
  } catch (cause) {
    peer.close();
    throw handshakeFailure(cause);
  }
}

/** The live session {@link connect} hands back. */
class Connection implements BridgeConnection {
  readonly sessionId: string;
  readonly grantedTokens: readonly string[];
  readonly protocolVersion: number;
  readonly peer: BridgePeer;

  private readonly client: SessionClient;

  constructor(peer: BridgePeer, client: SessionClient, result: HandshakeResult) {
    this.peer = peer;
    this.client = client;
    this.sessionId = result.sessionId;
    this.grantedTokens = Object.freeze([...result.grantedTokens]);
    this.protocolVersion = result.acceptedProtocolVersion;
  }

  onShutdown(listener: (params: ShutdownParams) => void): Unsubscribe {
    return this.client.onSessionShutdown(listener);
  }

  onClose(listener: () => void): Unsubscribe {
    return this.peer.onClose(listener);
  }

  close(): void {
    this.peer.close();
  }
}

/**
 * Read the host's answer as a handshake response. A peer that cannot name the
 * session it just granted is not one to start calling, so an unreadable answer
 * fails the connect rather than surfacing later as a missing field.
 */
function readHandshakeResult(answer: unknown): HandshakeResult {
  const result = answer as Partial<HandshakeResult> | null | undefined;
  if (
    typeof result?.sessionId !== "string" ||
    !Array.isArray(result.grantedTokens) ||
    result.grantedTokens.some((token) => typeof token !== "string")
  ) {
    throw new BridgeError({
      code: "HANDSHAKE_FAILED",
      message: "The ACE Studio bridge answered the handshake with no session id or granted-token list.",
      hint: "the peer on the other end may not be an ACE Studio bridge, or may speak a different protocol",
    });
  }
  return {
    acceptedProtocolVersion: typeof result.acceptedProtocolVersion === "number" ? result.acceptedProtocolVersion : 0,
    grantedTokens: result.grantedTokens,
    sessionId: result.sessionId,
  };
}

/**
 * Codes that already say exactly what went wrong during a handshake, and so
 * travel out of {@link connect} unchanged.
 */
const HANDSHAKE_PASSTHROUGH = new Set([
  "BRIDGE_UNREACHABLE",
  "TIMEOUT",
  "HANDSHAKE_FAILED",
  "PROTOCOL_VERSION_MISMATCH",
  "SURFACE_VERSION_MISMATCH",
]);

/**
 * Shape whatever went wrong during the handshake. Anything without a code of
 * its own — a JSON-RPC fault from the host, most of all — is the host refusing
 * us.
 */
function handshakeFailure(cause: unknown): BridgeError {
  if (cause instanceof BridgeError && HANDSHAKE_PASSTHROUGH.has(cause.code)) {
    return cause;
  }
  return new BridgeError({
    code: "HANDSHAKE_FAILED",
    message: `The ACE Studio bridge refused the handshake: ${(cause as Error)?.message ?? String(cause)}`,
    hint: "check the auth token and that the requested capabilities are inside this surface",
    cause,
  });
}

/**
 * The host echoes the protocol version it accepted. It gates the major itself,
 * so a mismatch here means the two sides disagree about what they just agreed —
 * which is worth refusing loudly rather than calling into.
 */
function protocolMismatch(result: HandshakeResult): BridgeError | undefined {
  if (result.acceptedProtocolVersion === PROTOCOL_VERSION) {
    return undefined;
  }
  return new BridgeError({
    code: "PROTOCOL_VERSION_MISMATCH",
    message:
      `This SDK speaks bridge protocol ${PROTOCOL_VERSION}, but the connected ACE Studio accepted ` +
      `${result.acceptedProtocolVersion} — the two do not share a wire.`,
    details: { expected: PROTOCOL_VERSION, actual: result.acceptedProtocolVersion },
    hint: "update whichever of ACE Studio and this SDK is older",
  });
}
