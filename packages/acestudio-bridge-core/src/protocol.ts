/**
 * The bridge wire contract: JSON-RPC 2.0 method names and payload shapes.
 *
 * @remarks
 * The handshake carries the canonical capability payload — protocol version,
 * auth token and requested capability names in; accepted version, granted
 * flat token names and a session id out (ADR 0093 §4). The *field set* is
 * fixed by that payload; the spelling below is ACE Studio's, mapped from its
 * Remote Control bridge, so nothing here is invented for the SDK.
 */

/**
 * The bridge protocol version this SDK speaks — the framing and RPC shape,
 * distinct from the contract surface version the bindings carry.
 *
 * @public
 */
export const PROTOCOL_VERSION = 5;

/**
 * Wire method names. The `bridge.` prefix is the driver's; the payloads are
 * the canonical ones.
 *
 * @public
 */
export const method = {
  /** Opens the session and carries the canonical handshake payload. */
  hello: "bridge.hello",
  /** Liveness echo, served by the SDK on the host's behalf. */
  ping: "bridge.ping",
  /** Invokes one catalog operation by canonical path. */
  invokeCommand: "bridge.invokeCommand",
} as const;

/**
 * The handshake request. `token` is the session-token primitive the host
 * minted for this peer; `requestedCapabilities` names profiles and/or tokens
 * and the registry resolves which — a host granting a full surface ignores it,
 * so it rides along as provenance either way.
 *
 * @public
 */
export interface HelloParams {
  token: string;
  /** Version of the consumer opening the session, for the host's logs. */
  sdkVersion: string;
  /** Process id of the consumer, for the host's logs. */
  pid: number;
  protocolVersion: number;
  requestedCapabilities?: readonly string[];
}

/**
 * The handshake response. `grantedCapabilities` is the session's grant as flat
 * canonical token names; `surfaceVersion` is the `major.minor` contract
 * version {@link connect} checks against the bindings'.
 *
 * @public
 */
export interface HelloResult {
  appVersion: string;
  protocolVersion: number;
  /** Empty from a host predating the field — then the version check is skipped. */
  surfaceVersion?: string;
  grantedCapabilities: readonly string[];
  sessionId: string;
}

/**
 * The liveness echo payload, in both directions: the nonce comes back
 * verbatim so the caller can correlate.
 *
 * @public
 */
export interface PingPayload {
  nonce: string;
}

/**
 * `bridge.invokeCommand` arguments. `path` is the canonical operation path
 * (`"transport set-loop"`, `"editor add-notes"`); `arguments` is the shape the
 * operation's schema describes.
 *
 * @public
 */
export interface InvokeCommandParams {
  path: string;
  arguments: Record<string, unknown>;
  /** Bounded wait for the busy gate; absent fails fast with `USER_BUSY`. */
  waitTimeoutMs?: number;
}

/**
 * An advisory fact about a completed operation. Never stripped at the wire:
 * muting is a surface's business.
 *
 * @public
 */
export interface CommandWarning {
  code: string;
  hint?: string;
}

/**
 * A refused operation. `code` is the canonical error code, `hint` the recovery
 * advice composed where the refusal happened.
 *
 * @public
 */
export interface CommandErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  hint?: string;
}

/**
 * What one operation answers: either `data` (optionally with `warnings`) or
 * `error`, never both.
 *
 * @public
 */
export interface CommandResultEnvelope<T = unknown> {
  data?: T;
  warnings?: readonly CommandWarning[];
  error?: CommandErrorPayload;
}
