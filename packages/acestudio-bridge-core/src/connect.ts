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

import { buildBindings, type OperationWarning } from "./bindings.js";
import { BridgeError } from "./errors.js";
import type { CapabilityToken, PublicBindings } from "./generated/bindings.js";
import {
  SessionClient,
  type HandshakeParams,
  type HandshakeResult,
  type PingParams,
  type PingResult,
  type ShutdownParams,
} from "./generated/Session.acerpc.js";
import { createGrant, requireTokens, type Grant, type ProfileName } from "./grant.js";
import { createJobHandle, type JobHandle } from "./jobs.js";
import { BridgePeer } from "./peer.js";
import { PROTOCOL_VERSION } from "./protocol.js";
import type { ProfileScopedBindings, ScopedBindings } from "./scoped.js";
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
  /**
   * What this session may reach, settled at the handshake. Read `grant.tokens`
   * to branch on it, `grant.missing(...)` to find out what a partial grant is
   * short of, and `grant.provenance.granted` for the host's answer verbatim.
   */
  readonly grant: Grant;
  /**
   * The typed operation surface: `client.track.list()`, `client.clip.create()` —
   * the canonical operation tree, one method per operation. A call the grant
   * cannot reach is refused here rather than on the wire.
   */
  readonly client: PublicBindings;
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
   * Assert this session reaches every one of `tokens`, so a consumer that
   * cannot work without them fails at startup instead of part-way through.
   *
   * @throws BridgeError with code `CAPABILITY_DENIED`, naming every missing
   * token — not just the first one found.
   */
  require(...tokens: CapabilityToken[]): void;
  /**
   * The same client, typed down to what a profile — or an explicit set of
   * tokens — can reach. A compile-time view and nothing more: the object handed
   * back is {@link BridgeConnection.client} itself, so scoping costs no runtime
   * machinery and cannot disagree with the guard that does the refusing.
   *
   * Nothing is checked at run time, here or by the returned client: an unknown
   * profile name reaching this from untyped JavaScript yields the whole client
   * rather than an error. Scoping is a view of *reach*, not a grant — the guard
   * reads the grant, so a call outside the session's grant is still refused.
   *
   * Extensions rarely call this. Their manifest is the requested set, so the
   * extension layer hands them a client already typed to it.
   */
  scoped<P extends ProfileName>(profile: P): ProfileScopedBindings<P>;
  scoped<T extends CapabilityToken>(...tokens: T[]): ScopedBindings<T>;
  /**
   * A {@link JobHandle} on a job in the ledger, by id — including one this
   * session did not start, since job visibility is project-session-wide with
   * attribution (ADR 0084). A job-class operation hands back its own handle; this
   * is how to get one for a job whose id arrived some other way.
   *
   * Nothing is checked here: an id that names no job fails on the first call the
   * handle makes, as the same id passed to `client.job.get` would.
   */
  job<Result = unknown>(id: string): JobHandle<Result>;
  /**
   * Called for each advisory warning an operation comes back with (ADR 0083 §2),
   * from any call on this connection. A warning never means the call failed — a
   * refusal is a thrown {@link BridgeError} — so this is a separate channel
   * rather than something folded into a return value.
   *
   * With no listener registered, warnings go to `console.warn` instead: Studio
   * captures the extension's stdio (ADR 0091 §5), so an unobserved advisory is
   * still recoverable from the log rather than dropped. Registering a listener
   * takes that over completely.
   */
  onWarning(listener: (warning: OperationWarning) => void): Unsubscribe;
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
    return new Connection(peer, client, result, options.requestedCapabilities ?? []);
  } catch (cause) {
    peer.close();
    throw handshakeFailure(cause);
  }
}

/** The live session {@link connect} hands back. */
class Connection implements BridgeConnection {
  readonly sessionId: string;
  readonly protocolVersion: number;
  readonly peer: BridgePeer;
  readonly grant: Grant;
  readonly client: PublicBindings;

  private readonly session: SessionClient;
  private readonly warningListeners = new Set<(warning: OperationWarning) => void>();

  constructor(peer: BridgePeer, session: SessionClient, result: HandshakeResult, requested: readonly string[]) {
    this.peer = peer;
    this.session = session;
    this.sessionId = result.sessionId;
    this.protocolVersion = result.acceptedProtocolVersion;
    this.grant = createGrant(result.sessionId, requested, result.grantedTokens);
    // The generated interface is what type-checks the callers; the runtime
    // builds every method from one table row, so there is nothing per-method
    // here for the compiler to check the construction against.
    this.client = buildBindings(peer, this.grant, (warning) => {
      this.reportWarning(warning);
    }) as unknown as PublicBindings;
  }

  onWarning(listener: (warning: OperationWarning) => void): Unsubscribe {
    this.warningListeners.add(listener);
    return () => {
      this.warningListeners.delete(listener);
    };
  }

  require(...tokens: CapabilityToken[]): void {
    requireTokens(this.grant, tokens);
  }

  // One implementation for both overloads: scoping is a type-level narrowing, so
  // the arguments only ever decide what the *caller* sees.
  scoped(): never {
    return this.client as never;
  }

  job<Result = unknown>(id: string): JobHandle<Result> {
    // Over the same guarded bindings a caller has: a session without `job.read`
    // gets the pre-wire refusal from the handle's first call, not a second gate
    // here.
    return createJobHandle<Result>(this.client.job, id);
  }

  onShutdown(listener: (params: ShutdownParams) => void): Unsubscribe {
    return this.session.onSessionShutdown(listener);
  }

  onClose(listener: () => void): Unsubscribe {
    return this.peer.onClose(listener);
  }

  close(): void {
    this.peer.close();
  }

  /**
   * Hand a warning to whoever is listening, or to the log if nobody is.
   *
   * The listener snapshot is taken first so one that unsubscribes mid-dispatch
   * does not reshape the set being walked. A listener that throws must not fail
   * the call it was reporting on — the operation already succeeded, and an
   * advisory is not worth turning into an error — so it goes to the log instead.
   */
  private reportWarning(warning: OperationWarning): void {
    if (this.warningListeners.size === 0) {
      logWarning(warning);
      return;
    }
    for (const listener of [...this.warningListeners]) {
      try {
        listener(warning);
      } catch (cause) {
        console.warn(`[ace-studio] a warning listener threw: ${(cause as Error)?.message ?? String(cause)}`);
      }
    }
  }
}

/**
 * The fallback for an unobserved warning. Studio captures the extension's stdio
 * (ADR 0091 §5), so this keeps an advisory recoverable from the log — the one
 * thing not to do with it is drop it silently.
 */
function logWarning(warning: OperationWarning): void {
  const hint = warning.hint === undefined ? "" : ` — ${warning.hint}`;
  console.warn(`[ace-studio] ${warning.path}: ${warning.code}${hint}`);
}

/**
 * Read the host's answer as a handshake response. A peer that cannot name the
 * session it just granted is not one to start calling, so an unreadable answer
 * fails the connect rather than surfacing later as a missing field.
 */
function readHandshakeResult(answer: unknown): HandshakeResult {
  const result = answer as Partial<HandshakeResult> | null | undefined;
  // The accepted version is checked here rather than defaulted, because there is
  // no honest default: coercing a missing field to 0 would come back out of
  // connect() as a version mismatch claiming the host speaks 0, when what
  // actually happened is that it never said. An answer missing any required
  // field is not a handshake answer.
  if (
    typeof result?.sessionId !== "string" ||
    typeof result.acceptedProtocolVersion !== "number" ||
    !Array.isArray(result.grantedTokens) ||
    result.grantedTokens.some((token) => typeof token !== "string")
  ) {
    throw new BridgeError({
      code: "HANDSHAKE_FAILED",
      message:
        "The ACE Studio bridge's handshake answer is missing its session id, accepted protocol version, or granted-token list.",
      hint: "the peer on the other end may not be an ACE Studio bridge, or may speak a different protocol",
    });
  }
  return {
    acceptedProtocolVersion: result.acceptedProtocolVersion,
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
