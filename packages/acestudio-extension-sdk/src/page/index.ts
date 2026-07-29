/**
 * The browser-only page side of an extension's UI channel, imported from
 * `@timedomain/acestudio-extension-sdk/page`.
 *
 * @remarks
 * An extension's page and its process share one protocol type: the page names it
 * once, at {@link connectChannel}, and gets back a client whose `call` and `on` are
 * typed to exactly what the process declared. Nothing here knows about ACE Studio's
 * bridge — the page talks to its own extension's process and to nothing else, which
 * is why no capability, token, or session appears in this file.
 *
 * This entry is a browser build and shares no runtime code with the process-side
 * entry: it uses `fetch` and nothing else, so it runs in a webview, in a framework
 * dev server's page, and in a test.
 *
 * @packageDocumentation
 */

import { decodeMessage, encodeMessage } from "../ui/binary.js";
import {
  CHANNEL_ORIGIN_PARAM,
  CHANNEL_PATH,
  FRAME_END,
  readFrame,
  type CallResponse,
  type CallsOf,
  type EventMessage,
  type EventsOf,
  type ParamsOf,
  type ResultOf,
  type UiProtocol,
} from "../ui/protocol.js";

// Re-exported so a page bundle needs nothing from the process-side entry, which is
// Node-only — including the derivations this entry's own signatures are written in.
export type { CallsOf, EventsOf, ParamsOf, ResultOf, UiCalls, UiEvents, UiProtocol } from "../ui/protocol.js";

/** How long to wait before re-opening a dropped event stream, and the ceiling it backs off to. */
const RETRY_FLOOR_MS = 200;
const RETRY_CEILING_MS = 2_000;

/**
 * What {@link connectChannel} needs, when the defaults are not right.
 *
 * @public
 */
export interface ConnectChannelOptions {
  /**
   * Where the extension's process is serving the channel.
   *
   * Rarely needed. A page served by its own extension finds the channel on its own
   * origin; a page served by a dev server finds it from the origin the SDK attached to
   * the URL it announced. This is for a page that arrived by neither route.
   */
  readonly url?: string;
}

/**
 * Per-call options.
 *
 * @public
 */
export interface CallOptions {
  /** Abort the call. What the process already started is not undone by aborting. */
  readonly signal?: AbortSignal;
}

/**
 * A call's arguments: the declared parameter, then the options. Spelled as a tuple so
 * `call("ping")` needs nothing, `call("render", { stem })` needs its parameter, and a
 * call the declaration gives no parameter passes `undefined` before its options.
 *
 * The positions are fixed rather than overloaded — options never slide forward into
 * the parameter's slot. A declared parameter can be any object, including `{}` or one
 * whose only field is `signal`, and a caller deciding what a value *meant* from its
 * shape would drop exactly those.
 *
 * Both positions are optional: `options` is never required, and a call whose
 * declaration takes no parameter takes no arguments at all. An editor shows this
 * directly; a rendered signature that spells the elements out cannot, since generated
 * docs drop the `?` these tuple elements carry.
 *
 * @public
 */
export type CallArgs<Params extends readonly unknown[]> = Params extends readonly []
  ? [params?: undefined, options?: CallOptions]
  : [params: Params[0], options?: CallOptions];

/**
 * The page's half of the channel, typed to the protocol both sides share.
 *
 * @public
 */
export interface PageChannel<P extends UiProtocol> {
  /**
   * Ask the process one of the protocol's `calls` and wait for its answer.
   *
   * There is no timeout, deliberately: only the extension's author knows which of
   * their calls should answer in 200 ms and which is a forty-minute render, and a
   * timeout the SDK picked would abandon the honest one. Pass `signal` to give a call
   * a deadline, or show a cancel control and abort it.
   *
   * @throws Error when the handler threw, when nothing handles that name, or when the
   * process cannot be reached. The message is the one the process reported.
   */
  call<K extends keyof CallsOf<P> & string>(
    name: K,
    ...args: CallArgs<ParamsOf<CallsOf<P>, K>>
  ): Promise<ResultOf<CallsOf<P>, K>>;
  /**
   * Listen for one of the protocol's `events`. Returns how to stop listening.
   *
   * Only what the process pushes from now on: an event emitted before this page
   * connected was not queued for it, so a page that needs current state asks for it
   * with a `call`.
   *
   * Unsubscribing stops the listener, not the stream — the connection stays open so a
   * component that remounts resumes without a reconnect gap. {@link PageChannel.close}
   * is what releases it.
   */
  on<K extends keyof EventsOf<P> & string>(name: K, listener: (payload: EventsOf<P>[K]) => void): () => void;
  /**
   * Stop listening and stop re-opening the stream. Calls already in flight are left
   * to finish. A page being torn down does not have to call this — closing the page
   * closes the stream — but a component that mounts and unmounts should.
   */
  close(): void;
}

/**
 * Connect to the process this page's extension runs in.
 *
 * Pass the same protocol type the process side names, exported from a module both
 * import — that shared type is what makes both halves of the conversation checked.
 *
 * @example
 * ```ts
 * import { connectChannel } from "@timedomain/acestudio-extension-sdk/page";
 * import type { StemsUi } from "../protocol.js";
 *
 * const channel = connectChannel<StemsUi>();
 * channel.on("progress", ({ done, total }) => setProgress(done / total));
 * const stems = await channel.call("listStems", { trackIndex: 0 });
 * ```
 *
 * @public
 */
export function connectChannel<P extends UiProtocol>(options: ConnectChannelOptions = {}): PageChannel<P> {
  const endpoint = channelEndpoint(options.url);
  const listeners = new Map<string, Set<(payload: never) => void>>();
  const stream = new EventStream(endpoint, (event) => {
    // A snapshot, so a listener that unsubscribes on its first event does not reshape
    // the set being walked.
    for (const listener of [...(listeners.get(event.name) ?? [])]) {
      (listener as (payload: unknown) => void)(event.payload);
    }
  });

  return {
    call: async (name, ...args) => {
      const [params, callOptions] = args;
      // The wire carries JSON: what comes back is whatever the handler answered, and
      // the protocol type is what already settled its shape on both ends.
      return (await post(endpoint, name, params, callOptions?.signal)) as never;
    },
    on: (name, listener) => {
      const forName = listeners.get(name) ?? new Set();
      listeners.set(name, forName);
      forName.add(listener as (payload: never) => void);
      stream.open();
      return () => {
        forName.delete(listener as (payload: never) => void);
      };
    },
    close: () => {
      listeners.clear();
      stream.close();
    },
  };
}

/**
 * Where the channel is, in the order a page can know it: what the caller passed, then
 * the origin the SDK attached to the URL it announced — which is how a page a dev
 * server is serving finds a process on a port nobody could predict — then the page's
 * own origin, where a page served by its own extension finds it.
 *
 * The last case resolves a bare path against the document, which is why it needs no
 * origin of its own and works in a page opened from a file too.
 */
function channelEndpoint(base: string | undefined): string {
  const announced = base ?? announcedChannelOrigin();
  if (announced === undefined) {
    return CHANNEL_PATH;
  }
  return new URL(CHANNEL_PATH, announced.endsWith("/") ? announced : `${announced}/`).toString();
}

/**
 * The channel origin the announced URL carried, if this page was loaded from one.
 * Read defensively: this module also runs where there is no `location` at all — a
 * test, a server-rendered pass — and having no query is the ordinary case.
 */
function announcedChannelOrigin(): string | undefined {
  // Cast because the DOM types promise a `location` that this module cannot count on:
  // the browser build is what ships, and the same module is imported by tests and by
  // a framework's server pass, where there is no document to have a URL.
  const here = (globalThis as { location?: Location }).location;
  if (here === undefined) {
    return undefined;
  }
  try {
    return new URL(here.href).searchParams.get(CHANNEL_ORIGIN_PARAM) ?? undefined;
  } catch {
    return undefined;
  }
}

async function post(
  endpoint: string,
  name: string,
  params: unknown,
  signal: AbortSignal | undefined,
): Promise<unknown> {
  const id = nextCallId();
  // Bytes in the parameters put the call in a binary frame; everything else stays
  // plain JSON, so an ordinary call pays nothing for a feature it does not use.
  const encoded = await encodeMessage({ id, name, ...(params === undefined ? {} : { params }) });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": encoded.contentType },
    body: encoded.body,
    ...(signal === undefined ? {} : { signal }),
  });
  if (!response.ok) {
    throw new Error(
      `the extension's process refused the call "${name}": ${String(response.status)} ${await response.text()}`,
    );
  }
  const answer = decodeMessage(
    response.headers.get("content-type") ?? undefined,
    new Uint8Array(await response.arrayBuffer()),
  ) as CallResponse;
  if (answer.error !== undefined) {
    throw new Error(answer.error.message);
  }
  return answer.result;
}

let lastCallId = 0;

/** Correlates an answer with its call. Only this page reads it, so a counter is enough. */
function nextCallId(): number {
  lastCallId += 1;
  return lastCallId;
}

/**
 * The event stream, kept open. The process is a peer that can go away and come back —
 * ACE Studio's developer reload respawns it under a page that is still on screen — so
 * a dropped stream is re-opened rather than treated as the end. It backs off, so a
 * process that is gone for good does not turn into a busy loop.
 */
class EventStream {
  private readonly endpoint: string;
  private readonly deliver: (event: EventMessage) => void;
  private abort: AbortController | undefined;
  private closed = false;
  private retryMs = RETRY_FLOOR_MS;

  constructor(endpoint: string, deliver: (event: EventMessage) => void) {
    this.endpoint = endpoint;
    this.deliver = deliver;
  }

  /** Open the stream if it is not open already. Safe to call on every subscription. */
  open(): void {
    if (this.closed || this.abort !== undefined) {
      return;
    }
    const attempt = new AbortController();
    this.abort = attempt;
    void this.pump(attempt);
  }

  close(): void {
    this.closed = true;
    this.abort?.abort();
    this.abort = undefined;
  }

  private async pump(attempt: AbortController): Promise<void> {
    try {
      const response = await fetch(this.endpoint, {
        headers: { accept: "text/event-stream" },
        signal: attempt.signal,
      });
      const body = response.body;
      if (!response.ok || body === null) {
        throw new Error(`the event stream answered ${String(response.status)}`);
      }
      this.retryMs = RETRY_FLOOR_MS;
      await this.read(body, attempt.signal);
    } catch {
      // Every failure is the same failure from here: the stream is not open. Whether
      // the process is restarting or gone for good is not knowable from this end, so
      // both cases wait and try again.
    }
    if (this.closed || attempt.signal.aborted) {
      return;
    }
    this.abort = undefined;
    const wait = this.retryMs;
    this.retryMs = Math.min(wait * 2, RETRY_CEILING_MS);
    setTimeout(() => {
      this.open();
    }, wait);
  }

  /** Read frames off the stream, delivering each complete one. */
  private async read(body: ReadableStream<Uint8Array>, signal: AbortSignal): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffered = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done || signal.aborted) {
        return;
      }
      buffered += decoder.decode(value, { stream: true });
      let boundary = buffered.indexOf(FRAME_END);
      while (boundary !== -1) {
        const event = readFrame(buffered.slice(0, boundary));
        if (event !== undefined) {
          this.deliver(event);
        }
        buffered = buffered.slice(boundary + FRAME_END.length);
        boundary = buffered.indexOf(FRAME_END);
      }
    }
  }
}
