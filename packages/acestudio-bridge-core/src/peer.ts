/**
 * The symmetric JSON-RPC 2.0 peer that sits on a {@link Transport}.
 *
 * @remarks
 * Both ends of the bridge call and are called, so one object does both:
 * outbound requests correlate by id, inbound requests route to served
 * handlers, and inbound notifications fan out to subscribers. It is
 * dependency-free on purpose — a public package that bundled a JSON-RPC
 * library would hand every consumer a second copy of it.
 */

import { BridgeError } from "./errors.js";
import type { JsonRpcFault, JsonRpcMessage } from "./protocol.js";
import type { Transport, Unsubscribe } from "./transport.js";

/**
 * Bounds one outbound call.
 *
 * @public
 */
export interface RequestOptions {
  /** Local deadline in milliseconds. The host-side work is unaffected. */
  timeoutMs?: number;
  /** Abort the local wait. The host-side work is unaffected. */
  signal?: AbortSignal;
}

/**
 * A handler served for one inbound method.
 *
 * @public
 */
export type RequestHandler = (params: unknown) => unknown;

/** JSON-RPC's own code for a method the peer does not serve. */
const METHOD_NOT_FOUND = -32601;

/** JSON-RPC's own code for a handler that threw. */
const INTERNAL_ERROR = -32603;

/** One outbound call still waiting for its answer. */
interface Pending {
  settle: (error: BridgeError | undefined, result: unknown) => void;
}

/**
 * A JSON-RPC peer over one transport.
 *
 * @public
 */
export class BridgePeer {
  private readonly transport: Transport;
  private readonly pending = new Map<number, Pending>();
  private readonly handlers = new Map<string, RequestHandler>();
  private readonly subscribers = new Map<string, Set<(params: unknown) => void>>();
  private readonly closeListeners = new Set<() => void>();
  private nextId = 1;
  private closed = false;

  constructor(transport: Transport) {
    this.transport = transport;
    transport.onMessage((message) => {
      this.receive(message);
    });
    transport.onClose(() => {
      this.handleClose();
    });
  }

  /** Whether the transport has closed. */
  get isClosed(): boolean {
    return this.closed;
  }

  /**
   * Call a method on the other side.
   *
   * @throws BridgeError with code `BRIDGE_UNREACHABLE` if the transport drops
   * first, or `TIMEOUT` if the deadline expires or the signal fires.
   */
  request<T>(method: string, params?: unknown, options: RequestOptions = {}): Promise<T> {
    if (this.closed) {
      return Promise.reject(this.unreachable(method));
    }
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const onAbort = (): void => {
        this.pending.get(id)?.settle(this.timedOut(method, options), undefined);
      };

      this.pending.set(id, {
        settle: (error, result) => {
          this.pending.delete(id);
          if (timer !== undefined) {
            clearTimeout(timer);
          }
          options.signal?.removeEventListener("abort", onAbort);
          if (error === undefined) {
            resolve(result as T);
          } else {
            reject(error);
          }
        },
      });

      if (options.signal?.aborted === true) {
        onAbort();
        return;
      }
      options.signal?.addEventListener("abort", onAbort, { once: true });
      if (options.timeoutMs !== undefined) {
        timer = setTimeout(onAbort, options.timeoutMs);
        // A pending call must never be the reason a process stays alive.
        timer.unref?.();
      }

      this.send({ jsonrpc: "2.0", id, method, params });
    });
  }

  /**
   * Bound a call the generated bindings make. Their peer interface takes no
   * options — the schema describes the wire, not the caller's patience — so a
   * deadline wraps the call from outside instead.
   *
   * @throws BridgeError with code `TIMEOUT` if the deadline expires or the
   * signal fires. The host-side work is unaffected either way.
   */
  async withDeadline<T>(options: RequestOptions, call: () => Promise<T>): Promise<T> {
    if (options.timeoutMs === undefined && options.signal === undefined) {
      return call();
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let detachSignal: (() => void) | undefined;
    const expiry = new Promise<never>((_resolve, reject) => {
      const abort = (): void => reject(this.timedOut("the call", options));
      if (options.signal?.aborted === true) {
        abort();
        return;
      }
      const signal = options.signal;
      if (signal !== undefined) {
        signal.addEventListener("abort", abort, { once: true });
        detachSignal = (): void => {
          signal.removeEventListener("abort", abort);
        };
      }
      if (options.timeoutMs !== undefined) {
        timer = setTimeout(abort, options.timeoutMs);
        timer.unref?.();
      }
    });
    try {
      return await Promise.race([call(), expiry]);
    } finally {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      // `once` only detaches a listener that fired. A caller's signal normally
      // outlives the call it guards — one controller for a whole session — so a
      // call that simply finished has to take its own listener back off, or each
      // one leaves a listener behind holding its closure.
      detachSignal?.();
    }
  }

  /** Send a notification — no id, no answer. */
  notify(method: string, params?: unknown): void {
    this.send({ jsonrpc: "2.0", method, params });
  }

  /**
   * Serve a method the other side may call. One handler per method. The name is
   * the one the generated bindings' peer interface expects.
   */
  setRequestHandler<P, R>(method: string, handler: (params: P) => R | Promise<R>): void {
    this.handlers.set(method, handler as RequestHandler);
  }

  /** Listen for one notification method. */
  subscribe<T = unknown>(method: string, listener: (params: T) => void): Unsubscribe {
    let listeners = this.subscribers.get(method);
    if (listeners === undefined) {
      listeners = new Set();
      this.subscribers.set(method, listeners);
    }
    const erased = listener as (params: unknown) => void;
    listeners.add(erased);
    return () => {
      listeners.delete(erased);
    };
  }

  /** Listen for the transport closing. */
  onClose(listener: () => void): Unsubscribe {
    if (this.closed) {
      queueMicrotask(listener);
      return () => {};
    }
    this.closeListeners.add(listener);
    return () => {
      this.closeListeners.delete(listener);
    };
  }

  /** Close the transport, failing every call still in flight. */
  close(): void {
    this.transport.close();
    this.handleClose();
  }

  private receive(message: string): void {
    let parsed: JsonRpcMessage;
    try {
      parsed = JSON.parse(message) as JsonRpcMessage;
    } catch {
      return; // Not JSON: there is no id to answer against, so drop it.
    }

    if (parsed.method === undefined) {
      this.settleResponse(parsed.id, parsed.result, parsed.error);
    } else if (parsed.id === undefined) {
      this.fanOut(parsed.method, parsed.params);
    } else {
      void this.answer(parsed.id, parsed.method, parsed.params);
    }
  }

  private settleResponse(id: number | undefined, result: unknown, fault: JsonRpcFault | undefined): void {
    if (id === undefined) {
      return;
    }
    const pending = this.pending.get(id);
    if (pending === undefined) {
      return; // Already settled by a timeout, an abort, or a close.
    }
    pending.settle(fault === undefined ? undefined : faultToBridgeError(fault), result);
  }

  private fanOut(method: string, params: unknown): void {
    for (const listener of this.subscribers.get(method) ?? []) {
      listener(params);
    }
  }

  private async answer(id: number, method: string, params: unknown): Promise<void> {
    const handler = this.handlers.get(method);
    if (handler === undefined) {
      this.send({ jsonrpc: "2.0", id, error: { code: METHOD_NOT_FOUND, message: `method not found: ${method}` } });
      return;
    }
    try {
      this.send({ jsonrpc: "2.0", id, result: (await handler(params)) ?? null });
    } catch (cause) {
      const fault: JsonRpcFault = { code: INTERNAL_ERROR, message: (cause as Error)?.message ?? String(cause) };
      this.send({ jsonrpc: "2.0", id, error: fault });
    }
  }

  private handleClose(): void {
    if (this.closed) {
      return;
    }
    this.closed = true;
    for (const pending of [...this.pending.values()]) {
      pending.settle(this.unreachable(), undefined);
    }
    this.pending.clear();
    const listeners = [...this.closeListeners];
    this.closeListeners.clear();
    for (const listener of listeners) {
      listener();
    }
  }

  private send(message: unknown): void {
    this.transport.send(JSON.stringify(message));
  }

  private unreachable(method?: string): BridgeError {
    return new BridgeError({
      code: "BRIDGE_UNREACHABLE",
      message:
        method === undefined
          ? "The bridge connection closed with calls in flight."
          : `The bridge connection is closed, so '${method}' was not sent.`,
      hint: "confirm ACE Studio is still running, then reconnect",
    });
  }

  private timedOut(method: string, options: RequestOptions): BridgeError {
    return new BridgeError({
      code: "TIMEOUT",
      message:
        options.signal?.aborted === true
          ? `The wait for '${method}' was aborted.`
          : `'${method}' did not answer within ${String(options.timeoutMs)}ms.`,
      hint: "the host may still be working — aborting the wait does not cancel it",
    });
  }
}

/** Map a JSON-RPC error object onto a {@link BridgeError}. */
function faultToBridgeError(fault: JsonRpcFault): BridgeError {
  // A host that has a canonical code to give puts it in `data.code`; a bare
  // JSON-RPC fault is a protocol-level failure, which `HANDLER_FAILED` names.
  const data = fault.data as { code?: unknown; details?: Record<string, unknown>; hint?: string } | undefined;
  const named = typeof data?.code === "string";
  const code = named ? (data.code as string) : "HANDLER_FAILED";
  return new BridgeError({
    code: code as BridgeError["code"],
    message: fault.message,
    // `details` is the code's declared shape when the code declares one, so the
    // numeric envelope code is not mixed into it. It rides along only for a fault
    // that named no canonical code, where it is the one diagnostic there is.
    details: normalizeDetails(code, named ? data.details : { ...data?.details, jsonRpcCode: fault.code }),
    hint: data?.hint,
  });
}

/**
 * Bring a host's details onto the shape the code declares.
 *
 * Only `CAPABILITY_DENIED` needs it: the host names the single token a refused
 * operation required in `details.token`, while the SDK promises `details.missing`
 * for every refusal — including `connection.require()`, which is about a set of
 * tokens and no one operation. Filling `missing` here is what lets a caller ask
 * one question of both, and is why a locally-guarded call and a host-refused one
 * are the same error rather than two spellings of it.
 */
function normalizeDetails(code: string, details: Record<string, unknown> | undefined): Record<string, unknown> {
  if (code !== "CAPABILITY_DENIED" || details === undefined) {
    return details ?? {};
  }
  const token = details.token;
  if (typeof token !== "string" || Array.isArray(details.missing)) {
    return details;
  }
  return { ...details, missing: [token] };
}
