/**
 * A scripted stand-in for the ACE Studio side of the bridge.
 *
 * Plays the host half of the generated surfaces: serves `session.handshake` and
 * one method per operation, calls `session.ping`, and emits `session.shutdown` and
 * `state.changed`. The payload types come from the generated modules, so a schema
 * change breaks this peer at compile time rather than letting the tests drift
 * away from the wire. A surface that only a layer above core speaks is scripted
 * through `methods`, by that layer's own suite.
 *
 * **The served operation names are derived, never authored.** They are exactly the
 * `wire` column of the surface table the SDK itself calls from, and anything else
 * is refused with `-32601` the way the real dispatcher refuses an unregistered
 * method. This is the one property that matters about this file: a hand-written
 * list of method names is a second copy of the host's contract, and a copy drifts.
 * It drifted once — the host retired the `operation.invoke` envelope and served
 * each operation under its own name, and because this peer named the retired verb
 * as a literal, every test kept passing against a fake that shared the client's
 * mistake. Derive, so the tests cannot agree with the client about a name the host
 * does not serve.
 *
 * Its two capability gates are transcriptions of the host's own. The inbound one
 * is `CommandRegistry::capabilityDenial`, reading the same generated
 * required-token table the Studio's table is generated from — which is what makes
 * this a fair witness for "the SDK's pre-wire refusal is the one the host would
 * have sent". The outbound one is `mayReceiveChannel`: a change goes out only if
 * the granted set reaches the channel's token, so a test can also witness the
 * case where the guard is the *only* thing that turns silence into an error.
 */

import {
  NOTIFICATION_CHANNELS,
  PROTOCOL_VERSION,
  PUBLIC_SURFACE,
  REQUIRED_TOKENS,
  type ChangeEvent,
  type DriverSurface,
  type HandshakeParams,
  type HandshakeResult,
  type JsonRpcFault,
  type JsonRpcMessage,
  type PingParams,
  type PingResult,
  type PrepareMoveResult,
  type ProjectRelocatedParams,
  type ShutdownParams,
  type Transport,
} from "@timedomain/acestudio-bridge-core";

/** The wire names the host side of the surfaces it serves uses. */
export const HOST_METHODS = {
  handshake: "session.handshake",
  ping: "session.ping",
  prepareMove: "session.prepareMove",
  projectRelocated: "session.projectRelocated",
  shutdown: "session.shutdown",
} as const;

/**
 * One call as it reached the host: the canonical path the wire name resolved to,
 * and the params object as sent. Protocol 2 has no envelope, so the arguments are
 * the params — reserved keys (`fingerprint`, `waitTimeoutMs`) included, since the
 * host reads those off the same object.
 */
export interface Invocation {
  /** The canonical operation path, recovered from the wire name that was called. */
  readonly path: string;
  /** The JSON-RPC method the SDK actually sent. */
  readonly wire: string;
  /** The params as they arrived. */
  readonly arguments: Record<string, unknown>;
}

/** The JSON-RPC envelope code the extension bridge refuses a capability with. */
export const CAPABILITY_DENIED_RPC_CODE = -32003;

/**
 * How the host answers one scripted operation.
 *
 * `data` is the whole answer, because protocol 2 returns the operation's result
 * and nothing wrapped around it. An operation that raises advisories declares
 * `warnings` on its own result type, so a test that wants them puts them inside
 * `data` — which is where a real host puts them too.
 */
export type ScriptedOperation = { data: unknown } | { fault: JsonRpcFault };

/**
 * A scripted answer computed from the invocation rather than fixed in advance —
 * what a subject with state behind it needs. The job ledger is the first: `job
 * get` has to answer differently once the job has moved on, and a fixed answer
 * would let a wait loop "finish" against a reply that was already written.
 */
export type ScriptedOperationHandler = (invocation: Invocation) => ScriptedOperation | Promise<ScriptedOperation>;

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
  /**
   * What each canonical operation path answers — a fixed answer, or one computed
   * from the invocation. A path with no entry answers `UNKNOWN_COMMAND`, as an
   * unknown path does on the real wire.
   */
  operations?: Readonly<Record<string, ScriptedOperation | ScriptedOperationHandler>>;
  /**
   * Host halves of surfaces core does not own, by wire name — the extension
   * platform's own verbs, scripted by the suite that tests them. Answering here is
   * returning a result; throwing a {@link JsonRpcFault} is refusing.
   *
   * Kept as an escape hatch rather than grown into this file: a surface that only one
   * layer above speaks belongs to that layer's tests, where its generated payload
   * types are what the script is written against.
   */
  methods?: Readonly<Record<string, (params: unknown) => unknown>>;
  /**
   * The surface whose `wire` column decides which operation methods this host
   * serves. Defaults to the public one; a suite exercising a driver that carries
   * the privileged artifact passes that surface so the host serves its names too.
   */
  surface?: DriverSurface;
}

/** The host end of a scripted session. */
export class ScriptedHostPeer {
  /** Resolves with the handshake request the peer sent. */
  readonly handshake: Promise<HandshakeParams>;
  /** Every invocation that reached the host, in order — including refused ones. */
  readonly invocations: Invocation[] = [];

  private readonly transport: Transport;
  private readonly options: ScriptedHostOptions;
  private readonly pending = new Map<number, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }>();
  private readonly grantedTokens: ReadonlySet<string>;
  /**
   * The served operation methods, derived from the surface table: wire name to
   * canonical path. Nothing outside this map is an operation, so a call to a name
   * the table does not carry falls through to `-32601`.
   */
  private readonly servedOperations: ReadonlyMap<string, string>;
  private announceHandshake!: (params: HandshakeParams) => void;
  private nextId = 1;
  /** The session revision counter the change envelope stamps. */
  private revision = 0;
  /** Set once a handshake succeeds: before that, nothing is authorized. */
  private granted = false;

  constructor(transport: Transport, options: ScriptedHostOptions = {}) {
    this.transport = transport;
    this.options = options;
    this.grantedTokens = new Set(options.grantedTokens ?? []);
    this.servedOperations = new Map(
      (options.surface ?? PUBLIC_SURFACE).operations.map((operation) => [operation.wire, operation.path]),
    );
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

  /**
   * Ask the peer to quiesce before relocating the project folder, and resolve
   * with what it answered — the host blocks on this, so the answer is the whole
   * point of the call.
   */
  async prepareMove(): Promise<PrepareMoveResult> {
    return (await this.request(HOST_METHODS.prepareMove)) as PrepareMoveResult;
  }

  /**
   * Tell the peer where the project folder ended up, which releases it from a
   * quiesce. Fire-and-forget, as the host sends it: the peer resumes on receipt
   * and there is nothing to answer.
   */
  relocateProject(params: ProjectRelocatedParams): void {
    this.send({ jsonrpc: "2.0", method: HOST_METHODS.projectRelocated, params });
  }

  /** Open the shutdown grace window, as the host's stop routine does. */
  notifyShutdown(params: ShutdownParams): void {
    this.send({ jsonrpc: "2.0", method: HOST_METHODS.shutdown, params });
  }

  /**
   * Report a change on `channel`, as a driver's fan-out does — including its
   * gate: a peer whose granted set does not reach the channel's token is sent
   * nothing at all, and no denial either, exactly as `mayReceiveChannel` decides
   * it. Returns whether the notification went out, so a test can tell "the host
   * withheld it" apart from "the SDK dropped it".
   */
  notifyChange(channel: string, changes: readonly string[] = [], revision = ++this.revision): boolean {
    // Named either way: a test says `jobs` because that is what the subject is
    // called, and the wire spells it `jobs.changed`.
    const row = NOTIFICATION_CHANNELS.find(
      (entry) => entry.notification === channel || entry.notification === `${channel}.changed`,
    );
    if (row === undefined || !this.grantedTokens.has(row.capability)) {
      return false;
    }
    // The channel IS the method now — a channel is its own declared notification,
    // so the host routes by name instead of stamping one onto a shared envelope.
    const params: ChangeEvent = { revision, changes: [...changes] };
    this.send({ jsonrpc: "2.0", method: row.notification, params });
    return true;
  }

  /**
   * Push a change on a channel this SDK build does not declare, skipping the gate
   * — what a host running a newer registry does. Worth being able to stage: it is
   * the same wire notification every channel rides, so a peer that fanned out by
   * anything other than the channel name would hand it to the wrong listener.
   */
  notifyUnknownChannel(channel: string, revision = ++this.revision): void {
    const params: ChangeEvent = { revision, changes: [] };
    this.send({ jsonrpc: "2.0", method: `${channel}.changed`, params });
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
    const path = this.servedOperations.get(target);
    if (path !== undefined) {
      return this.handleInvoke({
        path,
        wire: target,
        arguments: (params ?? {}) as Record<string, unknown>,
      });
    }
    const scripted = this.options.methods?.[target];
    if (scripted !== undefined) {
      if (!this.granted) {
        throw {
          code: -32001,
          message: "no established extension session",
          data: { code: "SESSION_INVALID" },
        } satisfies JsonRpcFault;
      }
      return scripted(params);
    }
    throw { code: -32601, message: `method not found: ${target}` } satisfies JsonRpcFault;
  }

  /**
   * Run the gated-invocation pipeline's first two steps (ADR 0093 §5) and answer
   * from the script: session valid, then capability granted. A well-behaved SDK
   * never reaches the second one — that is what `invocations` is recorded for.
   */
  private async handleInvoke(invocation: Invocation): Promise<unknown> {
    this.invocations.push(invocation);
    if (!this.granted) {
      throw {
        code: -32001,
        message: "no established extension session",
        data: { code: "SESSION_INVALID" },
      } satisfies JsonRpcFault;
    }

    const denial = this.capabilityDenial(invocation.path);
    if (denial !== undefined) {
      throw denial;
    }

    const entry = this.options.operations?.[invocation.path];
    // Awaited, so a handler may hold its answer — which is what `job wait` does
    // on the real wire when it long-polls (ADR 0092 §5).
    const scripted = typeof entry === "function" ? await entry(invocation) : entry;
    if (scripted === undefined) {
      throw {
        code: -32004,
        message: `unknown command: ${invocation.path}`,
        data: { code: "UNKNOWN_COMMAND" },
      } satisfies JsonRpcFault;
    }
    if ("fault" in scripted) {
      throw scripted.fault;
    }
    return scripted.data;
  }

  /**
   * `CommandRegistry::capabilityDenial`, transcribed: the token comes from the
   * generated table, an operation absent from it is ungated and passes, and the
   * refusal carries the canonical code, `details.token`, and the same wording.
   */
  private capabilityDenial(path: string): JsonRpcFault | undefined {
    const token = REQUIRED_TOKENS[path as keyof typeof REQUIRED_TOKENS] as string | undefined;
    if (token === undefined || this.grantedTokens.has(token)) {
      return undefined;
    }
    return {
      code: CAPABILITY_DENIED_RPC_CODE,
      message: `capability denied for command: ${path}`,
      data: {
        code: "CAPABILITY_DENIED",
        details: { token },
        hint: `missing capability token: ${token}`,
      },
    };
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
    this.granted = true;
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
