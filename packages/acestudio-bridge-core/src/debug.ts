/**
 * Debug mode: what the SDK did, at the level it was asked to do it.
 *
 * @remarks
 * There is no wire trace, deliberately (ADR 0091 §6). The wire is what this SDK
 * encapsulates, and a raw message stream would be illegible to somebody who only
 * ever wrote typed calls — so what a debug line names is the operation, the
 * capability, and how it ended, never a payload. Nothing that travels *inside* a
 * call is written here: not arguments, not results, and above all not the session
 * token.
 *
 * Lines go to stderr because ACE Studio captures an extension's stdio into its log
 * folder (ADR 0091 §5), which means the developer's tooling and their agent can read
 * them without this file knowing anything about files.
 */

/**
 * Where a debug line goes. One per connection, handed down to whatever does the
 * work, so nothing below has to know whether debug mode is on.
 *
 * @public
 */
export type DebugLog = (message: string) => void;

/** The prefix every line carries, so a reader can tell SDK lines from an extension's own. */
const PREFIX = "[ace-sdk]";

/** A log that goes nowhere, which is what "debug mode off" costs. */
const SILENT: DebugLog = () => undefined;

/**
 * A debug log, or a log that discards, depending on whether debug mode is on.
 *
 * Explicit boolean rather than an environment read: core has no idea what spawned
 * it, so the layer that does — the extension SDK, reading the variable the dev
 * tooling sets — is the one that decides.
 *
 * @public
 */
export function createDebugLog(enabled: boolean): DebugLog {
  if (!enabled) {
    return SILENT;
  }
  return (message: string) => {
    // Straight to the stream rather than through `console`, which is the
    // *extension's* logging story (ADR 0091 §5) — mixing the two would put SDK
    // bookkeeping in the middle of an author's own output.
    process.stderr.write(`${PREFIX} ${message}\n`);
  };
}
