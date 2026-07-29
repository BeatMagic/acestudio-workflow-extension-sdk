/**
 * The one type both ends of an extension's UI channel import.
 *
 * @remarks
 * An extension's page and its process are two programs that have to agree about
 * what they say to each other. Writing that agreement twice is how they stop
 * agreeing, so it is written once — as an interface naming the `calls` the page
 * makes and the `events` the process pushes — and each side derives its half from
 * it. A handler that answers the wrong shape, a `call` that passes the wrong
 * parameters, an `emit` of an event nobody declared: all compile errors, on
 * whichever side made the mistake.
 *
 * This module is imported by both the process side and the browser side, so it
 * holds types and constants only — no Node, no DOM.
 */

/**
 * A page→process call, written as an ordinary method signature: what the page
 * passes and what it gets back. An `async` signature is fine — the page always
 * awaits, so `Promise<T>` and `T` mean the same thing to a caller.
 *
 * The constraint is `(params: never) => unknown` rather than a looser `unknown`
 * parameter because that is the shape *every* function is assignable to: a
 * parameter type is contravariant, so `never` accepts any of them, and a
 * declaration is checked at the point that matters — where the handler is written.
 *
 * @public
 */
export type UiCalls = Readonly<Record<string, (params: never) => unknown>>;

/**
 * The process→page pushes, as a map from event name to payload type. A payload of
 * `void` is an event that carries nothing.
 *
 * @public
 */
export type UiEvents = Readonly<Record<string, unknown>>;

/**
 * What an extension's page and process say to each other.
 *
 * Declare one interface, `export` it from a module both sides import, and name it
 * at each end — {@link ExtensionUi.channel} in the process, `connectChannel` in
 * the page. Both halves are optional: a UI that only reports progress declares
 * `events` alone, and one that only asks questions declares `calls` alone.
 *
 * @example
 * ```ts
 * // protocol.ts — imported by both sides
 * import type { UiProtocol } from "@timedomain/acestudio-extension-sdk";
 *
 * export interface StemsUi extends UiProtocol {
 *   calls: {
 *     listStems(params: { trackIndex: number }): Promise<string[]>;
 *     render(params: { stem: string }): void;
 *   };
 *   events: {
 *     progress: { done: number; total: number };
 *   };
 * }
 * ```
 *
 * @public
 */
export interface UiProtocol {
  /** What the page asks the process, and what it gets back. */
  readonly calls?: UiCalls;
  /** What the process pushes to the page. */
  readonly events?: UiEvents;
}

/**
 * The `calls` half of a protocol, with the absent case filled in.
 *
 * @public
 */
export type CallsOf<P extends UiProtocol> = P["calls"] extends UiCalls ? P["calls"] : Record<never, never>;

/**
 * The `events` half of a protocol, with the absent case filled in.
 *
 * @public
 */
export type EventsOf<P extends UiProtocol> = P["events"] extends UiEvents ? P["events"] : Record<never, never>;

/**
 * The parameters of the call `K`, as a tuple — empty for a call that takes none.
 *
 * Written as a conditional rather than `Parameters<C[K]>` because `C` arrives here
 * as a lookup into a protocol type, which the compiler cannot see through far enough
 * to know it holds functions. The conditional is what tells it, and both ends derive
 * their signatures through it.
 *
 * @public
 */
export type ParamsOf<C, K extends keyof C> = C[K] extends (params: never) => unknown ? Parameters<C[K]> : never;

/**
 * What the call `K` answers, with a promise unwrapped: a signature declared `async`
 * already says `Promise<T>`, and this is what lets one declared `T` be answered by an
 * async handler anyway.
 *
 * @public
 */
export type ResultOf<C, K extends keyof C> = C[K] extends (params: never) => infer R ? Awaited<R> : never;

/**
 * The routes the channel occupies on the extension's own server, under one
 * reserved prefix so an extension's assets can use every other path. A `GET` opens
 * the event stream; a `POST` is one call.
 *
 * @internal
 */
export const CHANNEL_PATH = "/__ace/channel";

/**
 * One call, as it travels page→process.
 *
 * @internal
 */
export interface CallRequest {
  /** Correlates the answer with the call; opaque to the process. */
  readonly id: number;
  /** The declared call's name. */
  readonly name: string;
  /** Whatever the declaration's parameter is, or absent for a call that takes none. */
  readonly params?: unknown;
}

/**
 * One answer, as it travels process→page.
 *
 * @internal
 */
export interface CallResponse {
  readonly id: number;
  /** The handler's result. Absent when `error` is present. */
  readonly result?: unknown;
  /** Why the call failed — the handler threw, or nothing handles that name. */
  readonly error?: { readonly message: string };
}

/**
 * One push, as it travels process→page over the event stream.
 *
 * @internal
 */
export interface EventMessage {
  readonly name: string;
  readonly payload?: unknown;
}

/**
 * How a frame ends, and how its payload line starts — server-sent-event framing, so
 * the stream stays something a browser's tooling can read.
 *
 * Both are here rather than at either end because the two ends have to agree about
 * them, which is what this module is for: one writer and one reader spelling `\n\n`
 * separately is one spelling too many.
 *
 * @internal
 */
export const FRAME_END = "\n\n";
export const FRAME_DATA = "data:";

/**
 * One event as a frame on the wire.
 *
 * @internal
 */
export function frameEvent(event: EventMessage): string {
  return `${FRAME_DATA} ${JSON.stringify(event)}${FRAME_END}`;
}

/**
 * The event in one frame, or `undefined` when the frame carries none — a keep-alive
 * comment, or something that does not parse. A push has no caller to fail, so an
 * unreadable frame is skipped rather than thrown: taking the stream down over one bad
 * event would lose every good one after it.
 *
 * @internal
 */
export function readFrame(frame: string): EventMessage | undefined {
  const payload = frame
    .split("\n")
    .filter((line) => line.startsWith(FRAME_DATA))
    .map((line) => line.slice(FRAME_DATA.length).trim())
    .join("");
  if (payload.length === 0) {
    return undefined;
  }
  try {
    return JSON.parse(payload) as EventMessage;
  } catch {
    return undefined;
  }
}
