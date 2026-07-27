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

  /** Send a notification — no id, no answer. */
  notify(method: string, params?: unknown): void {
    this.send({ jsonrpc: "2.0", method, params });
  }

  /** Serve a method the other side may call. One handler per method. */
  serve(method: string, handler: RequestHandler): void {
    this.handlers.set(method, handler);
  }

  /** Listen for one notification method. */
  subscribe(method: string, listener: (params: unknown) => void): Unsubscribe {
    let listeners = this.subscribers.get(method);
    if (listeners === undefined) {
      listeners = new Set();
      this.subscribers.set(method, listeners);
    }
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
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
  const code = typeof data?.code === "string" ? data.code : "HANDLER_FAILED";
  return new BridgeError({
    code: code as BridgeError["code"],
    message: fault.message,
    details: { ...data?.details, jsonRpcCode: fault.code },
    hint: data?.hint,
  });
}
