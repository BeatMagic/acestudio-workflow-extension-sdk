/**
 * The connection core for programming against a running ACE Studio.
 *
 * @remarks
 * {@link connect} runs the canonical capability handshake over a pluggable
 * {@link Transport} and hands back a granted, session-established
 * {@link BridgeConnection}. Anything that can be refused is refused as a
 * {@link BridgeError}.
 *
 * @packageDocumentation
 */

export { connect } from "./connect.js";
export type { BridgeConnection, ConnectOptions } from "./connect.js";
export { BridgeError, isBridgeError, isCode } from "./errors.js";
export type { AnyBridgeErrorCode, BridgeErrorDetails, BridgeErrorInit, DetailsFor, SdkErrorCode } from "./errors.js";
export { encodeFrame, FrameDecoder, LocalSocketTransport } from "./local-socket.js";
export { BridgePeer } from "./peer.js";
export type { RequestHandler, RequestOptions } from "./peer.js";
export { PROTOCOL_VERSION } from "./protocol.js";
export type { JsonRpcFault, JsonRpcMessage } from "./protocol.js";
export { createTransportPair } from "./transport.js";
export type { Transport, TransportPair } from "./transport.js";
export type { Unsubscribe } from "./types-runtime.js";

// The generated core session surface (Session.acerpc): the handshake, liveness
// and shutdown wire shapes, and the client that speaks them. Regenerated in the
// Studio repo with `acerpcgen --ts-out`; this copy arrives by regen PR. Do not
// edit it here.
export * from "./generated/Session.acerpc.js";

// The generated capability bindings (ADR 0094 §2). Regenerated in the Studio
// repo by `cargo run -p ace_command_catalog --bin gen_sdk_bindings`; this copy
// arrives by regen PR and is drift-gated there. Do not edit it here.
export * from "./generated/bindings.js";
