/**
 * `connect()` — the one way into a running ACE Studio.
 *
 * @remarks
 * The handshake happens before the promise resolves, so a
 * {@link BridgeConnection} is always a granted, session-established peer:
 * there is no half-open state to check for. Options are explicit values only —
 * reading a socket path and a one-time token out of the spawn environment
 * belongs to the layer above, which knows what spawned it.
 */

import { BridgeError } from "./errors.js";
import { SURFACE_VERSION } from "./generated/bindings.js";
import { BridgePeer, type RequestOptions } from "./peer.js";
import {
  BRIDGE_METHODS,
  PROTOCOL_VERSION,
  type CommandResultEnvelope,
  type HelloParams,
  type HelloResult,
  type PingPayload,
} from "./protocol.js";
import type { Transport, Unsubscribe } from "./transport.js";

/** How long the handshake waits for the host, when the caller sets no deadline. */
const DEFAULT_HANDSHAKE_TIMEOUT_MS = 10_000;

/**
 * What {@link connect} needs to open a session.
 *
 * @public
 */
export interface ConnectOptions {
  /** The message port to speak over. */
  transport: Transport;
  /** The session token the host minted for this peer. */
  authToken: string;
  /**
   * Capability names to request — profiles, tokens, or both; the registry
   * resolves which. A host that grants a whole surface ignores them.
   */
  requestedCapabilities?: readonly string[];
  /** Version of the connecting consumer, for the host's logs. */
  clientVersion?: string;
  /** Deadline for the handshake, in milliseconds. */
  timeoutMs?: number;
  /** Abort the handshake. */
  signal?: AbortSignal;
}

/**
 * Options for a raw {@link BridgeConnection.invoke} call.
 *
 * @public
 */
export interface InvokeOptions extends RequestOptions {
  /**
   * Wait up to this many milliseconds for the user to finish an edit gesture
   * before failing `USER_BUSY`. Omitting it fails fast.
   */
  waitBusy?: number;
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
   * The bridge protocol version the host accepted. Informational: ACE Studio
   * does not gate the session on it, so neither does this SDK.
   */
  readonly protocolVersion: number;
  /** The host's contract surface version, or `""` if it reported none. */
  readonly surfaceVersion: string;
  /** The version of ACE Studio on the other end. */
  readonly appVersion: string;
  /**
   * The JSON-RPC peer underneath. The generated bindings ride it, and it stays
   * the escape hatch for a call the bindings do not cover.
   */
  readonly peer: BridgePeer;
  /**
   * Invoke one catalog operation by canonical path, unwrapping the
   * command-result envelope down to its `data`. Call `bridge.invokeCommand`
   * through {@link BridgeConnection.peer} instead to read the whole envelope,
   * warnings included.
   *
   * @throws BridgeError carrying the host's code when the operation is refused.
   */
  invoke<T = unknown>(path: string, args?: Record<string, unknown>, options?: InvokeOptions): Promise<T>;
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
 * `SURFACE_VERSION_MISMATCH` if its contract surface is a different major than
 * these bindings', `BRIDGE_UNREACHABLE` if the transport drops, or `TIMEOUT`
 * if the handshake outruns its deadline.
 *
 * @public
 */
export async function connect(options: ConnectOptions): Promise<BridgeConnection> {
  const peer = new BridgePeer(options.transport);
  // Served before the handshake goes out: a host is free to probe liveness
  // from the moment it has a peer to probe.
  peer.serve(
    BRIDGE_METHODS.ping,
    (params) => ({ nonce: (params as PingPayload | undefined)?.nonce ?? "" }) satisfies PingPayload,
  );

  const hello: HelloParams = {
    token: options.authToken,
    sdkVersion: options.clientVersion ?? "",
    pid: currentPid(),
    protocolVersion: PROTOCOL_VERSION,
    requestedCapabilities: options.requestedCapabilities,
  };

  try {
    const answer = await peer.request<unknown>(BRIDGE_METHODS.hello, hello, {
      timeoutMs: options.timeoutMs ?? DEFAULT_HANDSHAKE_TIMEOUT_MS,
      signal: options.signal,
    });
    const result = readHelloResult(answer);
    const surfaceVersion = result.surfaceVersion ?? "";
    const mismatch = majorMismatch(surfaceVersion);
    if (mismatch !== undefined) {
      throw mismatch;
    }
    return new Connection(peer, result, surfaceVersion);
  } catch (cause) {
    peer.close();
    throw handshakeFailure(cause);
  }
}

/**
 * Read the host's answer as a handshake response. A peer that cannot even
 * name the session it just granted is not one to start calling, so an
 * unreadable answer fails the connect rather than surfacing later as a
 * missing field.
 */
function readHelloResult(answer: unknown): HelloResult {
  const result = answer as Partial<HelloResult> | null | undefined;
  if (
    typeof result?.sessionId !== "string" ||
    !Array.isArray(result.grantedCapabilities) ||
    result.grantedCapabilities.some((token) => typeof token !== "string")
  ) {
    throw new BridgeError({
      code: "HANDSHAKE_FAILED",
      message: "The ACE Studio bridge answered the handshake with no session id or granted-capability list.",
      hint: "the peer on the other end may not be an ACE Studio bridge, or may speak a different protocol",
    });
  }
  return {
    appVersion: typeof result.appVersion === "string" ? result.appVersion : "",
    protocolVersion: typeof result.protocolVersion === "number" ? result.protocolVersion : 0,
    surfaceVersion: typeof result.surfaceVersion === "string" ? result.surfaceVersion : "",
    grantedCapabilities: result.grantedCapabilities,
    sessionId: result.sessionId,
  };
}

/** The live session {@link connect} hands back. */
class Connection implements BridgeConnection {
  readonly sessionId: string;
  readonly grantedTokens: readonly string[];
  readonly protocolVersion: number;
  readonly surfaceVersion: string;
  readonly appVersion: string;
  readonly peer: BridgePeer;

  constructor(peer: BridgePeer, hello: HelloResult, surfaceVersion: string) {
    this.peer = peer;
    this.sessionId = hello.sessionId;
    this.grantedTokens = Object.freeze([...hello.grantedCapabilities]);
    this.protocolVersion = hello.protocolVersion;
    this.surfaceVersion = surfaceVersion;
    this.appVersion = hello.appVersion;
  }

  async invoke<T = unknown>(path: string, args: Record<string, unknown> = {}, options: InvokeOptions = {}): Promise<T> {
    const envelope = await this.peer.request<CommandResultEnvelope<T>>(
      BRIDGE_METHODS.invokeCommand,
      { path, arguments: args, waitTimeoutMs: options.waitBusy },
      { timeoutMs: options.timeoutMs, signal: options.signal },
    );
    if (envelope?.error !== undefined) {
      throw BridgeError.fromCommandError(envelope.error);
    }
    return envelope?.data as T;
  }

  onClose(listener: () => void): Unsubscribe {
    return this.peer.onClose(listener);
  }

  close(): void {
    this.peer.close();
  }
}

/**
 * Codes that already say exactly what went wrong during a handshake, and so
 * travel out of {@link connect} unchanged.
 */
const HANDSHAKE_PASSTHROUGH = new Set(["BRIDGE_UNREACHABLE", "TIMEOUT", "SURFACE_VERSION_MISMATCH", "HANDSHAKE_FAILED"]);

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
    hint: "check the auth token and that the requested capabilities exist on this surface",
    cause,
  });
}

/**
 * Compare the host's contract surface against the one these bindings were
 * generated from. Only the major matters — minor drift is the tolerant-reader
 * rule at work — and a host reporting no version predates the field.
 */
function majorMismatch(hostVersion: string): BridgeError | undefined {
  if (hostVersion === "") {
    return undefined;
  }
  const hostMajor = Number(hostVersion.split(".")[0]);
  const bindingsMajor = Number(SURFACE_VERSION.split(".")[0]);
  if (hostMajor === bindingsMajor) {
    return undefined;
  }
  return new BridgeError({
    code: "SURFACE_VERSION_MISMATCH",
    message:
      `This SDK speaks ACE Studio surface ${SURFACE_VERSION}, but the connected Studio speaks ${hostVersion} — ` +
      "a different major, so the two contracts are not compatible.",
    details: { expected: SURFACE_VERSION, actual: hostVersion },
    hint: Number.isNaN(hostMajor)
      ? "the host reported a surface version this SDK cannot read"
      : hostMajor > bindingsMajor
        ? "update this SDK to a release built for the newer surface"
        : "update ACE Studio, or install a release of this SDK built for the older surface",
  });
}

/** The process id to report, or `0` where there is no process to name. */
function currentPid(): number {
  return typeof process === "undefined" ? 0 : (process.pid ?? 0);
}
