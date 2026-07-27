/**
 * The parts of the wire contract that are not generated.
 *
 * @remarks
 * The session surface — method names, handshake payload, ping, shutdown notice —
 * is generated from `Session.acerpc` into `./generated/Session.acerpc.js`. Import
 * it from there; nothing about those shapes is restated here, because a second
 * hand-written copy of a wire is how the two ends drift apart.
 *
 * What is left is the protocol version, which the schema has no construct for.
 */

/**
 * The bridge protocol version this SDK speaks — the framing and RPC shape,
 * distinct from the contract surface version the bindings carry. A host
 * accepting a different major fails the handshake.
 *
 * @remarks
 * Mirrors `WorkflowExtensionHandshake::kProtocolVersion` on the Studio side.
 *
 * @public
 */
export const PROTOCOL_VERSION = 1;

/**
 * The error object a JSON-RPC peer answers with in place of a result. The host
 * puts the canonical error code on `data.code`.
 *
 * @public
 */
export interface JsonRpcFault {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * A JSON-RPC 2.0 message as it arrives, before it is classified: a request has
 * `method` and `id`, a notification `method` alone, a response `id` with
 * `result` or `error`.
 *
 * @public
 */
export interface JsonRpcMessage {
  jsonrpc?: string;
  id?: number;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: JsonRpcFault;
}
