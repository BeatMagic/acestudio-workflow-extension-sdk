/**
 * One error class for everything the bridge can refuse.
 *
 * @remarks
 * Host refusals, the pre-wire capability guard, and the SDK's own failures all
 * arrive as a {@link BridgeError}. `code` is what you branch on — a string
 * literal union, so a `switch` over it is exhaustiveness-checked — and `hint`
 * and `details` ride along. There is no subclass per code: narrowing `code`
 * with {@link isCode} does the job a subclass would.
 */

import type { BridgeErrorCode } from "./generated/bindings.js";

/**
 * Codes the SDK raises on its own, without a host answer to quote. They are
 * canonical-style and reserved for the SDK; `BRIDGE_UNREACHABLE` and `TIMEOUT`
 * are also canonical host codes, and mean the same thing from either side.
 *
 * @public
 */
export type SdkErrorCode =
  /** The transport never opened, or dropped with work in flight. */
  | "BRIDGE_UNREACHABLE"
  /** The host refused the handshake, or answered something unreadable. */
  | "HANDSHAKE_FAILED"
  /**
   * The host's payload does not match the operation's declared shape — a bulk
   * blob whose bytes do not come to `count × sizeof(dtype)`, for instance.
   * Nothing was decoded: the alternative is handing back data that is quietly
   * short.
   */
  | "MALFORMED_PAYLOAD"
  /** The host speaks a different major of the bridge wire itself. */
  | "PROTOCOL_VERSION_MISMATCH"
  /** The host's contract surface is a different major than the bindings'. */
  | "SURFACE_VERSION_MISMATCH"
  /** A local deadline expired, or the caller's `AbortSignal` fired. */
  | "TIMEOUT";

/**
 * Every code a {@link BridgeError} can carry: the generated canonical codes
 * plus the SDK-local ones.
 *
 * @public
 */
export type AnyBridgeErrorCode = BridgeErrorCode | SdkErrorCode;

/**
 * What `details` holds for the codes that promise a shape. Any other code
 * narrows to a plain object — a code gains an entry here when its details
 * become a contract.
 *
 * @public
 */
export interface BridgeErrorDetails {
  CAPABILITY_DENIED: {
    /**
     * The tokens the session's grant is short of. Always populated — a refused
     * call names the one token it needed, and `connection.require()` names every
     * token it asked for and did not get.
     */
    missing: readonly string[];
    /**
     * The single token a refused operation required, as the host spells it in
     * `details.token`. Absent when the refusal was not about one operation.
     */
    token?: string;
  };
  PROTOCOL_VERSION_MISMATCH: {
    /** The bridge protocol version this SDK speaks. */
    expected: number;
    /** The version the host said it accepted. */
    actual: number;
  };
  SURFACE_VERSION_MISMATCH: {
    /** The surface version the bindings were generated from. */
    expected: string;
    /** The surface version the host reported. */
    actual: string;
  };
}

/**
 * What `details` holds for one code: the declared shape when there is one,
 * and a plain object otherwise.
 *
 * @public
 */
export type DetailsFor<C extends AnyBridgeErrorCode> = C extends keyof BridgeErrorDetails
  ? BridgeErrorDetails[C]
  : Record<string, unknown>;

/**
 * Everything a {@link BridgeError} carries beyond its message.
 *
 * @public
 */
export interface BridgeErrorInit<C extends AnyBridgeErrorCode = AnyBridgeErrorCode> {
  code: C;
  message: string;
  /** Structured context for the code. */
  details?: DetailsFor<C>;
  /** Recovery advice, composed where the refusal happened. */
  hint?: string;
  /** The lower-level failure this one wraps. */
  cause?: unknown;
}

/**
 * A refused bridge operation.
 *
 * @public
 */
export class BridgeError<C extends AnyBridgeErrorCode = AnyBridgeErrorCode> extends Error {
  /** The canonical code to branch on. */
  readonly code: C;
  /** Structured context; empty when the code carries none. */
  readonly details: DetailsFor<C>;
  /** Recovery advice, when the failure could compose one. */
  readonly hint?: string;

  constructor(init: BridgeErrorInit<C>) {
    super(init.message, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = "BridgeError";
    this.code = init.code;
    this.details = (init.details ?? {}) as DetailsFor<C>;
    if (init.hint !== undefined) {
      this.hint = init.hint;
    }
  }
}

/**
 * Whether a caught value is a {@link BridgeError}.
 *
 * @public
 */
export function isBridgeError(value: unknown): value is BridgeError {
  return value instanceof BridgeError;
}

/**
 * Whether a caught value is a {@link BridgeError} with a particular code,
 * narrowing `details` to that code's shape.
 *
 * @public
 */
export function isCode<C extends AnyBridgeErrorCode>(value: unknown, code: C): value is BridgeError<C> {
  return isBridgeError(value) && value.code === code;
}
