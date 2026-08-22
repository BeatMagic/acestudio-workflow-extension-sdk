/**
 * The connection core for programming against a running ACE Studio.
 *
 * @remarks
 * `connect()` runs the canonical capability handshake over a pluggable
 * {@link Transport} and hands back a granted, session-established
 * {@link BridgeConnection}. Anything that can be refused is refused as a
 * {@link BridgeError}.
 *
 * @packageDocumentation
 */

export type { OperationWarning } from "./bindings.js";
export { connect } from "./connect.js";
export type { BridgeConnection, ConnectOptions } from "./connect.js";
export { createDebugLog } from "./debug.js";
export type { DebugLog } from "./debug.js";
export { BridgeError, isBridgeError, isCode } from "./errors.js";
export type { AnyBridgeErrorCode, BridgeErrorDetails, BridgeErrorInit, DetailsFor, SdkErrorCode } from "./errors.js";
export type { Grant, GrantProvenance, ProfileName } from "./grant.js";
export type {
  JobHandle,
  JobResult,
  JobResultChild,
  JobSnapshot,
  JobWaitOptions,
  JobWaitOutcome,
} from "./jobs.js";
export { encodeFrame, FrameDecoder, LocalSocketTransport } from "./local-socket.js";
export { BridgePeer } from "./peer.js";
export type { RequestHandler, RequestOptions } from "./peer.js";
export { PROTOCOL_VERSION } from "./protocol.js";
export type { JsonRpcFault, JsonRpcMessage } from "./protocol.js";
export type {
  ProfileScopedBindings,
  ProfileTokens,
  ScopedBindings,
  ScopedBindingsOf,
  TokensOfProfile,
} from "./scoped.js";
// The vocabulary the scoped types are defined in. They are part of the public
// surface because those signatures name them — api-extractor refuses to describe a
// public type in terms of hidden ones, and it is right to: a consumer reading the
// report cannot see what the scoped client expands to otherwise. `Camel` has to
// stay a named type regardless, because it recurses.
export type {
  ArtifactRow,
  AtRoot,
  AtRootOf,
  Camel,
  ChannelRow,
  Descriptor,
  InDomain,
  InDomainOf,
  Reachable,
  ReachableIn,
  SurfaceRow,
} from "./scoped.js";
export { createTransportPair } from "./transport.js";
export type { Transport, TransportPair } from "./transport.js";
// `Unsubscribe` is deliberately not re-exported from here. The generated
// bindings below declare it — they have to stand alone — and two public spellings
// of `() => void` under one name is one more than anyone needs.

// The generated core session surface (Session.acerpc): the handshake, liveness
// and shutdown wire shapes, and the client that speaks them. Regenerated in the
// Studio repo with `acerpcgen --ts-out`; this copy arrives by regen PR. Do not
// edit it here.
export * from "./generated/Session.acerpc.js";

// The generated change-notification surface (Change.acerpc): the one wire
// notification every observable channel rides, and its envelope. Same provenance
// as the surfaces above — regenerated in the Studio repo, committed here.
export * from "./generated/Change.acerpc.js";

// The generated capability bindings (ADR 0094 §2). Same provenance as the
// surfaces above — regenerated in the Studio repo, committed here, and
// drift-gated there. Do not edit it here.
export * from "./generated/bindings.js";
