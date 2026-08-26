export interface Streams {
  out: (text: string) => void;
  err: (text: string) => void;
}

/**
 * Human-vs-machine output, one place. Progress steps and notes go to stderr
 * and are suppressed under `--quiet` or `--json`, so stdout stays clean for
 * piping. In `--json` mode every terminal path emits exactly one object on
 * stdout — a result object on success, `{ error, code }` on failure — so an
 * agent or script parses one line regardless of outcome.
 */
export class Reporter {
  constructor(
    private readonly opts: { json: boolean; quiet: boolean },
    private readonly streams: Streams,
  ) {}

  /** A progress step (the ✓/→ lines). Never in JSON or quiet mode. */
  step(text: string): void {
    if (!this.opts.json && !this.opts.quiet) this.streams.err(`${text}\n`);
  }

  /**
   * Something the user should know happened but that is not an error. Always
   * stderr, and never suppressed: a caution nobody sees under `--quiet` is not
   * worth emitting, and stderr keeps `--json`'s one-object stdout contract.
   */
  warn(text: string): void {
    this.streams.err(`warning: ${text}\n`);
  }

  result(human: string, data: Record<string, unknown>): void {
    if (this.opts.json) this.streams.out(`${JSON.stringify(data)}\n`);
    else this.streams.out(`${human}\n`);
  }

  failure(message: string, code: string): void {
    if (this.opts.json) this.streams.out(`${JSON.stringify({ error: message, code })}\n`);
    else this.streams.err(`error: ${message}\n`);
  }
}
