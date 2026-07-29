/**
 * The process side of the page↔process channel.
 *
 * @remarks
 * The extension's process answers what its page asks and pushes what its page
 * should know. Both directions are derived from the one protocol type the two sides
 * share, so this file has no opinion about what an extension's UI talks about — it
 * routes names to handlers and payloads to streams, and the compiler is what makes
 * sure the names and payloads line up.
 */

import { describeFailure, ExtensionError } from "../errors.js";
import type {
  CallRequest,
  CallResponse,
  CallsOf,
  EventMessage,
  EventsOf,
  ParamsOf,
  ResultOf,
  UiProtocol,
} from "./protocol.js";

/**
 * What `emit` takes beside the event name: the declared payload, or nothing at all
 * when the event declares `void`.
 *
 * @public
 */
export type EmitArgs<Payload> = [Payload] extends [void] ? [] : [payload: Payload];

/**
 * What answers the call `K`: the declaration's own parameters, and its result or a
 * promise of it.
 *
 * @public
 */
export type CallHandler<C, K extends keyof C> = (...args: ParamsOf<C, K>) => ResultOf<C, K> | Promise<ResultOf<C, K>>;

/**
 * The process's half of the channel, typed to the protocol both sides share.
 *
 * @public
 */
export interface UiChannel<P extends UiProtocol> {
  /**
   * Answer one of the protocol's `calls`. The handler's parameters and result come
   * from the declaration, so a handler that answers the wrong shape does not
   * compile.
   *
   * One handler per name: registering a second for a name already handled throws,
   * because the two cannot both be what the page reaches and picking one silently
   * would make the loser look like it never ran.
   */
  handle<K extends keyof CallsOf<P> & string>(name: K, handler: CallHandler<CallsOf<P>, K>): void;
  /**
   * Push one of the protocol's `events` to every page currently connected.
   *
   * A push with no page listening is dropped rather than queued: an extension's
   * window is opened by the user, and a progress bar's history is not what they want
   * to see when they open it. Emit what is true now, and let a page that just
   * connected ask.
   */
  emit<K extends keyof EventsOf<P> & string>(name: K, ...payload: EmitArgs<EventsOf<P>[K]>): void;
}

/** Where a connected page's event stream is written. */
export interface EventSink {
  /** Write one framed event. Throwing means the page is gone. */
  write(event: EventMessage): void;
}

/**
 * The one channel behind every typed view of it: the handler table, the connected
 * pages, and the routing between them.
 *
 * @internal
 */
export class ChannelHub {
  private readonly handlers = new Map<string, (params: unknown) => unknown>();
  private readonly sinks = new Set<EventSink>();

  /**
   * A view of this channel typed to `P`. Compile-time only — every view is this
   * same hub, so naming a protocol costs no runtime machinery and two views cannot
   * disagree about what is registered.
   */
  typed<P extends UiProtocol>(): UiChannel<P> {
    return {
      handle: (name, handler) => {
        // The hub is untyped on purpose: the wire carries JSON, and the protocol type
        // is what makes the two ends agree about it. Types are erased here, once, at
        // the one boundary where a name stops being a declaration and becomes a string.
        this.register(name, handler as unknown as (params: unknown) => unknown);
      },
      emit: (name, ...payload) => {
        this.push({ name, ...(payload.length === 0 ? {} : { payload: payload[0] }) });
      },
    };
  }

  /** Whether anything answers `name` — what tells a missing handler from a failing one. */
  handles(name: string): boolean {
    return this.handlers.has(name);
  }

  /**
   * Run one call and shape the answer the page reads. A handler that throws is
   * reported to the page *and* logged: the page can show its own error, and the
   * stack the author needs is in the log ACE Studio captures.
   */
  async invoke(request: CallRequest): Promise<CallResponse> {
    const handler = this.handlers.get(request.name);
    if (handler === undefined) {
      return { id: request.id, error: { message: `this extension handles no UI call named "${request.name}"` } };
    }
    try {
      const result = await handler(request.params);
      return { id: request.id, ...(result === undefined ? {} : { result }) };
    } catch (error) {
      console.error(`[ace-studio] the UI call "${request.name}" failed: ${describeFailure(error)}`);
      return { id: request.id, error: { message: describeFailure(error) } };
    }
  }

  /** Attach a connected page's stream, and hand back how to detach it. */
  attach(sink: EventSink): () => void {
    this.sinks.add(sink);
    return () => {
      this.sinks.delete(sink);
    };
  }

  /** Drop every connected page — the server is going away. */
  detachAll(): void {
    this.sinks.clear();
  }

  private register(name: string, handler: (params: unknown) => unknown): void {
    if (this.handlers.has(name)) {
      throw new ExtensionError(`the UI call "${name}" already has a handler`, {
        hint: "register each call once; to change what a call does, branch inside its handler",
      });
    }
    this.handlers.set(name, handler);
  }

  /**
   * Fan one event out. A sink that throws is a page whose socket died between the
   * last write and this one, which is not the emitting code's problem — drop it and
   * keep going, so one dead page cannot stop the others from being told.
   */
  private push(event: EventMessage): void {
    for (const sink of [...this.sinks]) {
      try {
        sink.write(event);
      } catch {
        this.sinks.delete(sink);
      }
    }
  }
}
