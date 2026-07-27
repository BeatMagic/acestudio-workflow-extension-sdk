/**
 * A scripted stand-in for the ACE Studio side of the bridge.
 *
 * Speaks the canonical handshake payload (ADR 0093 §4) and the command-result
 * envelope in ACE Studio's spelling, so a test can drive the real SDK stack
 * over the transport seam without a Studio process. Its wire shapes come from
 * the package's own `protocol` module rather than being restated here, so the
 * peer cannot drift from the contract it stands in for.
 */

import {
  BRIDGE_METHODS,
  PROTOCOL_VERSION,
  type CommandErrorPayload,
  type CommandResultEnvelope,
  type CommandWarning,
  type HelloParams,
  type HelloResult,
  type JsonRpcFault,
  type JsonRpcMessage,
  type PingPayload,
  type Transport,
} from "@timedomain/acestudio-bridge-core";

/** One `bridge.invokeCommand` the host received. */
export interface InvokeRecord {
  path: string;
  arguments: Record<string, unknown>;
  waitTimeoutMs?: number;
}

/** Everything the script can decide about how the host behaves. */
export interface ScriptedHostOptions {
  /** Refuse `bridge.hello` unless the peer presents this token. */
  authToken?: string;
  /** Flat canonical token names to grant. */
  grantedTokens?: readonly string[];
  sessionId?: string;
  appVersion?: string;
  protocolVersion?: number;
  /**
   * The `major.minor` contract surface version to report. `""` models a host
   * predating the field.
   */
  surfaceVersion?: string;
  /** Answer the handshake with this instead of a well-formed response. */
  helloResult?: unknown;
  /** Handlers for `bridge.invokeCommand`, keyed by canonical operation path. */
  commands?: Record<string, (invocation: InvokeRecord) => CommandResultEnvelope | Promise<CommandResultEnvelope>>;
}

/** Build a success envelope. */
export function ok<T>(data: T, warnings?: readonly CommandWarning[]): CommandResultEnvelope<T> {
  return warnings === undefined ? { data } : { data, warnings };
}

/** Build a refusal envelope. */
export function fail(
  code: string,
  message: string,
  extra?: { details?: Record<string, unknown>; hint?: string },
): CommandResultEnvelope<never> {
  const error: CommandErrorPayload = { code, message };
  if (extra?.details !== undefined) {
    error.details = extra.details;
  }
  if (extra?.hint !== undefined) {
    error.hint = extra.hint;
  }
  return { error };
}

/** The host end of a scripted session. */
export class ScriptedHostPeer {
  /** Resolves with the handshake request the peer sent. */
  readonly hello: Promise<HelloParams>;
  /** Every `bridge.invokeCommand` received, in order. */
  readonly invocations: InvokeRecord[] = [];

  private readonly transport: Transport;
  private readonly options: ScriptedHostOptions;
  private readonly pending = new Map<number, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }>();
  private announceHello!: (params: HelloParams) => void;
  private nextId = 1;

  constructor(transport: Transport, options: ScriptedHostOptions = {}) {
    this.transport = transport;
    this.options = options;
    this.hello = new Promise<HelloParams>((resolve) => {
      this.announceHello = resolve;
    });
    transport.onMessage((message) => {
      void this.receive(message);
    });
    transport.onClose(() => {
      for (const { reject } of this.pending.values()) {
        reject(new Error("scripted host transport closed"));
      }
      this.pending.clear();
    });
  }

  /** Push a notification to the connected peer. */
  emit(notification: string, params?: unknown): void {
    this.send({ jsonrpc: "2.0", method: notification, params });
  }

  /** Probe the peer's liveness echo and resolve with the nonce it returned. */
  async ping(nonce: string): Promise<string> {
    const result = (await this.request(BRIDGE_METHODS.ping, { nonce } satisfies PingPayload)) as PingPayload;
    return result.nonce;
  }

  /** Call a method on the connected peer. */
  request(target: string, params?: unknown): Promise<unknown> {
    const id = this.nextId++;
    return new Promise<unknown>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.send({ jsonrpc: "2.0", id, method: target, params });
    });
  }

  /** Drop the connection, as a Studio crash or shutdown would. */
  close(): void {
    this.transport.close();
  }

  private async receive(message: string): Promise<void> {
    const parsed = JSON.parse(message) as JsonRpcMessage;

    if (parsed.method === undefined) {
      this.settle(parsed);
      return;
    }
    if (parsed.id === undefined) {
      return; // A notification from the peer; nothing here consumes one yet.
    }

    const id = parsed.id;
    try {
      this.send({ jsonrpc: "2.0", id, result: (await this.dispatch(parsed.method, parsed.params)) ?? null });
    } catch (error) {
      this.send({ jsonrpc: "2.0", id, error: toFault(error) });
    }
  }

  private settle(parsed: JsonRpcMessage): void {
    if (parsed.id === undefined) {
      return;
    }
    const waiter = this.pending.get(parsed.id);
    if (waiter === undefined) {
      return;
    }
    this.pending.delete(parsed.id);
    if (parsed.error !== undefined) {
      waiter.reject(parsed.error);
    } else {
      waiter.resolve(parsed.result);
    }
  }

  private async dispatch(target: string, params: unknown): Promise<unknown> {
    if (target === BRIDGE_METHODS.hello) {
      return this.handleHello(params as HelloParams);
    }
    if (target === BRIDGE_METHODS.invokeCommand) {
      return this.handleInvoke(params as InvokeRecord);
    }
    throw { code: -32601, message: `method not found: ${target}` } satisfies JsonRpcFault;
  }

  private handleHello(params: HelloParams): unknown {
    this.announceHello(params);
    if (this.options.authToken !== undefined && params.token !== this.options.authToken) {
      throw { code: -32001, message: "unauthorized" } satisfies JsonRpcFault;
    }
    if (this.options.helloResult !== undefined) {
      return this.options.helloResult;
    }
    return {
      appVersion: this.options.appVersion ?? "3.0.0",
      protocolVersion: this.options.protocolVersion ?? PROTOCOL_VERSION,
      surfaceVersion: this.options.surfaceVersion ?? "2.0",
      grantedCapabilities: this.options.grantedTokens ?? [],
      sessionId: this.options.sessionId ?? "session-1",
    } satisfies HelloResult;
  }

  private async handleInvoke(params: InvokeRecord): Promise<CommandResultEnvelope> {
    this.invocations.push(params);
    const handler = this.options.commands?.[params.path];
    if (handler === undefined) {
      return fail("UNKNOWN_COMMAND", `no scripted handler for '${params.path}'`);
    }
    return handler(params);
  }

  private send(message: JsonRpcMessage): void {
    this.transport.send(JSON.stringify(message));
  }
}

/** Shape whatever a handler threw as a JSON-RPC error object. */
function toFault(error: unknown): JsonRpcFault {
  const thrown = error as Partial<JsonRpcFault> & { message?: string };
  return typeof thrown?.code === "number"
    ? (thrown as JsonRpcFault)
    : { code: -32603, message: thrown?.message ?? String(error) };
}
