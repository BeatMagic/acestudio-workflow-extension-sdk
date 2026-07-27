/**
 * A scripted stand-in for the ACE Studio side of the bridge.
 *
 * Plays the host half of the generated session surface: serves
 * `session.handshake`, calls `session.ping`, and emits `session.shutdown`. The
 * payload types come from the generated module, so a schema change breaks this
 * peer at compile time rather than letting the tests drift away from the wire.
 * The method names are literals — the host spells them, and `HOST_METHODS` is
 * asserted against the generated map in wire.test.ts.
 */

import {
  PROTOCOL_VERSION,
  type HandshakeParams,
  type HandshakeResult,
  type JsonRpcFault,
  type JsonRpcMessage,
  type PingParams,
  type PingResult,
  type ShutdownParams,
  type Transport,
} from "@timedomain/acestudio-bridge-core";

/** The wire names the host side of the session surface uses. */
export const HOST_METHODS = {
  handshake: "session.handshake",
  ping: "session.ping",
  shutdown: "session.shutdown",
} as const;

/** Everything the script can decide about how the host behaves. */
export interface ScriptedHostOptions {
  /** Refuse the handshake unless the peer presents this token. */
  authToken?: string;
  /** Flat canonical token names to grant. */
  grantedTokens?: readonly string[];
  sessionId?: string;
  /** The protocol version to report as accepted. */
  acceptedProtocolVersion?: number;
  /** Answer the handshake with this instead of a well-formed response. */
  handshakeResult?: unknown;
}

/** The host end of a scripted session. */
export class ScriptedHostPeer {
  /** Resolves with the handshake request the peer sent. */
  readonly handshake: Promise<HandshakeParams>;

  private readonly transport: Transport;
  private readonly options: ScriptedHostOptions;
  private readonly pending = new Map<number, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }>();
  private announceHandshake!: (params: HandshakeParams) => void;
  private nextId = 1;

  constructor(transport: Transport, options: ScriptedHostOptions = {}) {
    this.transport = transport;
    this.options = options;
    this.handshake = new Promise<HandshakeParams>((resolve) => {
      this.announceHandshake = resolve;
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

  /** Probe the peer's liveness echo and resolve with the nonce it returned. */
  async ping(nonce: string): Promise<string> {
    const result = (await this.request(HOST_METHODS.ping, { nonce } satisfies PingParams)) as PingResult;
    return result.nonce;
  }

  /** Open the shutdown grace window, as the host's stop routine does. */
  notifyShutdown(params: ShutdownParams): void {
    this.send({ jsonrpc: "2.0", method: HOST_METHODS.shutdown, params });
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
    if (target === HOST_METHODS.handshake) {
      return this.handleHandshake(params as HandshakeParams);
    }
    throw { code: -32601, message: `method not found: ${target}` } satisfies JsonRpcFault;
  }

  private handleHandshake(params: HandshakeParams): unknown {
    this.announceHandshake(params);
    if (this.options.authToken !== undefined && params.authToken !== this.options.authToken) {
      // The canonical code rides on data.code, as the host's own gate does.
      throw {
        code: -32001,
        message: "unauthorized",
        data: { code: "SESSION_INVALID" },
      } satisfies JsonRpcFault;
    }
    if (this.options.handshakeResult !== undefined) {
      return this.options.handshakeResult;
    }
    return {
      acceptedProtocolVersion: this.options.acceptedProtocolVersion ?? PROTOCOL_VERSION,
      grantedTokens: [...(this.options.grantedTokens ?? [])],
      sessionId: this.options.sessionId ?? "session-1",
    } satisfies HandshakeResult;
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
