/**
 * The extension layer's own failure class.
 *
 * @remarks
 * Anything the *bridge* refuses arrives as core's `BridgeError`, code and all.
 * This is for the layer above it, where there is no wire and no canonical code to
 * quote: a manifest that would not install, a definition the choreography cannot
 * run, a spawn environment that says the process was not started by ACE Studio.
 * One class, as in core — the message says what is wrong and `hint` says what to
 * do about it.
 */

/**
 * A manifest, definition, or spawn environment the SDK will not run with.
 *
 * @public
 */
export class ExtensionError extends Error {
  /** What to do about it, when the failure could compose something concrete. */
  readonly hint?: string;

  constructor(message: string, options: { hint?: string; cause?: unknown } = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = "ExtensionError";
    if (options.hint !== undefined) {
      this.hint = options.hint;
    }
  }
}

/**
 * An {@link ExtensionError}, or whatever else was thrown, as one line for the log.
 * Studio captures the extension's stderr, so this is what a developer actually
 * reads when a run refuses to start.
 *
 * @internal
 */
export function describeFailure(error: unknown): string {
  if (error instanceof ExtensionError && error.hint !== undefined) {
    return `${error.message} — ${error.hint}`;
  }
  const hint = (error as { hint?: unknown } | undefined)?.hint;
  const message = (error as Error | undefined)?.message ?? String(error);
  return typeof hint === "string" ? `${message} — ${hint}` : message;
}
