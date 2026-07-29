/**
 * `JobHandle` — the typed handle over the `job.*` contract (ADR 0094 §6).
 *
 * @remarks
 * Long-running work resolves on *acceptance*, never on completion: a job-class
 * operation hands back a handle carrying the job's id, and observing it is
 * something the caller then asks for. That is async-by-default held to (#1493) —
 * a handle is not a promise of the result, and there is no thenable magic that
 * would let `await launch()` quietly block until the work finished.
 *
 * Everything here is **sugar over `client.job.*`**. Each method is one call on
 * the generated job bindings, so a handle can do nothing a consumer holding the
 * bindings could not do by hand — including the capability guard, which the
 * bindings apply on the handle's behalf. One wire contract, and the ledger stays
 * observable by anyone granted `job.read`, jobs they started or not.
 */

import { BridgeError, describeCause, isBridgeError, isCode } from "./errors.js";
import type {
  CallOptions,
  ChangeEvent,
  JobGetResult,
  JobOperations,
  JobWaitResult,
  MutatingCallOptions,
  Unsubscribe,
} from "./generated/bindings.js";

/** How long a poll's local deadline outlives the wait budget it carries. */
const WAIT_CALL_GRACE_MS = 5_000;

/**
 * How long the wait loop leaves between polls when the host answers at once.
 *
 * `job wait` is a long-poll: a host that has nothing to report holds the call
 * (ADR 0092 §5), so the loop normally goes round only when something moved. This
 * is the floor for the host that answers immediately anyway — without it, an
 * unbounded wait against such a host is a spin loop.
 */
const DEFAULT_POLL_INTERVAL_MS = 250;

/**
 * A job as the ledger reports it — lifecycle, progress where the class declares
 * it, and the result children, each settling on its own (ADR 0084).
 *
 * @public
 */
export type JobSnapshot = JobGetResult;

/**
 * What a bounded {@link JobHandle.wait} may ask for.
 *
 * @public
 */
export interface JobWaitOptions {
  /**
   * Give up waiting after this many milliseconds and answer `timeout`. Omitted,
   * the wait runs until the job is terminal.
   *
   * Waiting only observes: an expiry never cancels the job, and the work keeps
   * running (ADR 0084).
   */
  timeoutMs?: number;
  /**
   * Abort the local wait. The job is untouched — this stops watching, it does
   * not stop the work.
   *
   * @throws BridgeError with code `TIMEOUT`, unlike an expired `timeoutMs`: a
   * bound the caller declared has a defined outcome, an abort is the caller
   * changing their mind mid-wait.
   */
  signal?: AbortSignal;
  /**
   * Least time between polls, in milliseconds, when the host answers a poll
   * immediately instead of holding it. Defaults to 250ms.
   */
  pollIntervalMs?: number;
}

/**
 * How a bounded wait ended. The snapshot rides along either way: a wait that
 * expired still says where the job had got to, which is the whole reason a
 * timeout is an outcome here rather than a thrown error — the CLI spends an exit
 * code on the same distinction (`job wait`, exit 4), and ADR 0092 §5 makes it a
 * structured non-error for MCP.
 *
 * `finished` means terminal, not successful: a job that failed or was cancelled
 * finished too. Read `job.lifecycle`.
 *
 * @public
 */
export interface JobWaitOutcome {
  /** Whether the job reached a terminal lifecycle, or the wait's bound expired first. */
  readonly status: "finished" | "timeout";
  /** The job as of the poll that ended the wait. */
  readonly job: JobSnapshot;
}

/**
 * A handle on one job in the ledger.
 *
 * `Result` is the job class's declared output, which its result children carry
 * once they settle. It is `unknown` for a handle attached by id, since an id
 * alone does not say what class the job is.
 *
 * @public
 */
export interface JobHandle<Result = unknown> {
  /** The ledger's stable id for this job — what `client.job.*` takes. */
  readonly id: string;
  /**
   * Watch the job: the listener is handed a fresh snapshot every time the ledger
   * reports this job moved, until the returned {@link Unsubscribe} is called.
   *
   * A change notification is a hint to re-read rather than the new state (ADR
   * 0083 §2.4), so each hint costs one `job get` and the listener sees the
   * answer. Progress is a real fraction only where the class declares one
   * (`hasProgress`); otherwise a snapshot is the lifecycle and result states
   * moving, which is what there is to report.
   *
   * A re-read that fails is logged rather than delivered — the listener takes
   * snapshots, and there is no honest snapshot to hand it — and the subscription
   * survives, so the next change reads again. Watch `connection.onClose` for the
   * one failure that ends it.
   *
   * @throws BridgeError with code `CAPABILITY_DENIED` if the grant cannot read
   * the ledger — raised here rather than leaving a listener that never fires.
   */
  onProgress(listener: (job: JobSnapshot) => void): Unsubscribe;
  /**
   * Wait for the job to reach a terminal lifecycle, bounded by `options`.
   *
   * The waiting is explicit and it only observes: nothing here cancels the job,
   * on expiry or otherwise. Cancelling is {@link JobHandle.cancel}, and only ever
   * that.
   *
   * An expiry is an outcome; a host that stops answering is not. If a poll goes
   * unanswered past its own deadline this raises `TIMEOUT` rather than reporting
   * a timeout outcome, because there is no snapshot behind an answer that never
   * came, and inventing one would be worse than saying so.
   */
  wait(options?: JobWaitOptions): Promise<JobWaitOutcome>;
  /**
   * The job's result children, each with its own settling state.
   *
   * This is the retrieval step `staged` delivery exists for: results land in
   * session history rather than in the project, and putting one somewhere is a
   * separate `client.job.place` the caller makes when it has decided where
   * (ADR 0084). A `direct`-delivery class places its own results, so calling
   * this on one reports what was placed rather than offering anything to place.
   *
   * A job carries 0..N of them — a single clip, a stem splitter's several, a
   * song generator's progressively-settling two.
   */
  result(options?: CallOptions): Promise<readonly JobResult<Result>[]>;
  /**
   * Ask the ledger to stop the job.
   *
   * Cancelability is declared per job class and reported honestly: a class that
   * cannot be stopped answers rather than pretending, and this passes that
   * answer on rather than guessing locally.
   *
   * @throws BridgeError with code `JOB_NOT_CANCELLABLE` for a class that does
   * not cancel, or `CAPABILITY_DENIED` without `job.control`.
   */
  cancel(options?: MutatingCallOptions): Promise<void>;
}

/**
 * One of a job's result children (ADR 0084).
 *
 * `Result` is the job class's declared output, which a settled child carries
 * alongside its id and state. It defaults to `unknown`, which adds nothing: a
 * handle attached by id, or one for a class that declares no output, sees the
 * two fields the ledger guarantees.
 *
 * @public
 */
export type JobResult<Result = unknown> = JobResultChild & Result;

/**
 * What the ledger guarantees about every result child, whatever produced it.
 *
 * @public
 */
export interface JobResultChild {
  /** The result id — what `client.job.place` and `discardResult` take. */
  readonly id: string;
  /**
   * How far the result has settled. `streaming` means playable and still
   * growing in real time: the audio can be auditioned, and even placed, before
   * it settles, and a placed streaming pattern flips to the final version by
   * itself (ADR 0084). Only a `streamingCapable` class ever reaches it.
   */
  readonly state: "pending" | "streaming" | "settled" | "failed";
}

/**
 * What a job-class operation's catalog entry says about the jobs it launches.
 *
 * @internal
 */
export interface JobClassDescriptor {
  /** The producing function's class id, e.g. `stem-split`. */
  readonly jobClass: string;
  /** The result field the accepted job's id arrives in. */
  readonly idField: string;
}

/**
 * Which operations launch a job, keyed by canonical path.
 *
 * Hand-written and empty, for now. No operation on the public surface declares a
 * job class — the generative group that will is not published yet — so there is
 * nothing for the generator to emit, and an emitted empty table would look the
 * same as this. When the catalog declares one, this becomes generated output
 * beside `BULK_PARAM_FIELDS` and the seam below stops needing a table of its own.
 *
 * The emitter owes the *type* as well as the row: a job-class operation's
 * generated signature has to promise `Promise<JobHandle<Result>>`, since the
 * runtime already hands one back. Until then the two disagree, and a caller
 * reaching a launch op through the generated interface has to say so with a cast.
 *
 * @internal
 */
export const JOB_CLASS_OPERATIONS: JobClassTable = {};

/**
 * The job-class rows the binding runtime reads. Overridable for the same reason
 * the bulk tables are: an unexercised path is one nobody would notice failing.
 *
 * @internal
 */
export type JobClassTable = Readonly<Record<string, JobClassDescriptor>>;

/**
 * The id of the job an operation's answer just accepted.
 *
 * A job-producing operation always returns one synchronously (ADR 0084), so an
 * answer without it is not an acceptance this side can work with: a handle
 * addressed to nothing would fail later, somewhere the launch is no longer in
 * view.
 *
 * @internal
 */
export function acceptedJobId(path: string, row: JobClassDescriptor, data: unknown): string {
  const id = (data as Record<string, unknown> | null | undefined)?.[row.idField];
  if (typeof id !== "string" || id === "") {
    throw new BridgeError({
      code: "MALFORMED_PAYLOAD",
      message: `'${path}' launches a ${row.jobClass} job but its answer carried no '${row.idField}'.`,
      hint: "a job-producing operation answers with the job's id; the host may be older than these bindings",
    });
  }
  return id;
}

/**
 * Attach a handle to a job by id, over the generated job bindings.
 *
 * Nothing is checked here — an id that names no job fails on the first call that
 * asks the host about it, which is also what happens to the same id passed to
 * `client.job.get`.
 *
 * @internal
 */
export function createJobHandle<Result = unknown>(job: JobOperations, id: string): JobHandle<Result> {
  return new Handle<Result>(job, id);
}

/** The handle {@link createJobHandle} hands out. */
class Handle<Result> implements JobHandle<Result> {
  readonly id: string;

  /** The generated `job` group. Every method below is one call on it. */
  private readonly job: JobOperations;

  constructor(job: JobOperations, id: string) {
    this.job = job;
    this.id = id;
  }

  onProgress(listener: (job: JobSnapshot) => void): Unsubscribe {
    // The subscription itself is the guarded call: `job.onChanged` refuses a
    // grant that cannot read the ledger, and this inherits that refusal rather
    // than composing a second one.
    const watch = new Watch(this.id, () => this.job.get({ id: this.id }), listener);
    const unsubscribe = this.job.onChanged((event) => {
      if (concerns(event, this.id)) {
        watch.refresh();
      }
    });
    return () => {
      watch.stop();
      unsubscribe();
    };
  }

  async result(options?: CallOptions): Promise<readonly JobResult<Result>[]> {
    const answer = await this.job.results({ id: this.id }, options);
    // The children come back as the ledger describes them, and the class's
    // declared output rides on those same objects — so there is nothing to
    // reshape, and nothing here to check it against either: the class's schema is
    // the caller's type parameter, which the runtime does not carry. Same seam as
    // `BridgeConnection.client`, asserted once where the typed view is handed out.
    return answer.results as unknown as readonly JobResult<Result>[];
  }

  async cancel(options?: MutatingCallOptions): Promise<void> {
    await this.job.cancel({ id: this.id }, options);
  }

  async wait(options: JobWaitOptions = {}): Promise<JobWaitOutcome> {
    const startedAt = Date.now();
    const floor = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;

    for (;;) {
      if (options.signal?.aborted === true) {
        throw waitAborted(this.id);
      }
      // The remaining budget goes out as the poll's own bound, so a host that
      // holds the call holds it no longer than the caller is prepared to wait.
      // The local deadline sits a grace period beyond it: the two racing on the
      // same number would decide a poll's fate by clock skew.
      const remaining = options.timeoutMs === undefined ? undefined : Math.max(0, options.timeoutMs - elapsed(startedAt));
      const polledAt = Date.now();
      const answer = await this.job.wait(
        { ids: [this.id], any: false, timeoutMs: remaining },
        { signal: options.signal, timeoutMs: remaining === undefined ? undefined : remaining + WAIT_CALL_GRACE_MS },
      );
      const job = this.snapshotIn(answer);

      if (answer.done) {
        return { status: "finished", job };
      }
      // The bound is only ever declared spent against a poll that has just
      // answered — never against one still to come. A job that finished while the
      // loop was waiting to ask again finished inside the bound, and saying
      // `timeout` because nobody looked would be a false negative.
      if (options.timeoutMs !== undefined && elapsed(startedAt) >= options.timeoutMs) {
        return { status: "timeout", job };
      }

      // What is left of the bound, and how much of it the loop may spend before
      // asking again. Clamping the nap to what is left puts the last poll on the
      // deadline instead of an interval past it: `wait({timeoutMs: 100})` against
      // a host that answers instantly answers at 100ms, not at 250.
      const left = options.timeoutMs === undefined ? Infinity : options.timeoutMs - elapsed(startedAt);
      const nap = Math.min(floor - elapsed(polledAt), left);
      if (nap > 0) {
        await pause(nap, options.signal, this.id);
      }
    }
  }

  /**
   * This job's row in a poll's answer. A `job wait` that came back without the
   * job it was asked about is not an answer to work from: treating the absence as
   * "not finished" would spin, and as "finished" would invent a result.
   */
  private snapshotIn(answer: JobWaitResult): JobSnapshot {
    const job = answer.jobs.find((row) => row.id === this.id);
    if (job === undefined) {
      throw new BridgeError({
        code: "MALFORMED_PAYLOAD",
        message: `The host's answer to 'job wait' did not include job '${this.id}'.`,
        hint: "the job may belong to another project session, which this session cannot observe",
      });
    }
    return job;
  }
}

/**
 * Whether a change on the `jobs` channel is about one job.
 *
 * One channel carries the whole ledger, so a handle sees every job's changes and
 * reads `changes` to find its own. An empty list is a coalesced hint that names
 * nothing — the notification primitive allows it, and the honest response is to
 * re-read rather than assume nothing of ours moved.
 */
function concerns(event: ChangeEvent, id: string): boolean {
  return event.changes.length === 0 || event.changes.includes(id);
}

/**
 * One `onProgress` subscription's re-read loop.
 *
 * The ledger can move faster than a round trip: a burst of changes must not
 * become a burst of overlapping reads whose answers arrive out of order and walk
 * a listener's view of the lifecycle backwards. So one read is in flight at a
 * time, and a change that lands during it sets a flag that costs exactly one more
 * read afterwards, however many arrived.
 */
class Watch {
  private readonly id: string;
  private readonly read: () => Promise<JobSnapshot>;
  private readonly listener: (job: JobSnapshot) => void;
  private reading = false;
  private again = false;
  private stopped = false;

  constructor(id: string, read: () => Promise<JobSnapshot>, listener: (job: JobSnapshot) => void) {
    this.id = id;
    this.read = read;
    this.listener = listener;
  }

  /** Note that the job moved, and read it if a read is not already running. */
  refresh(): void {
    if (this.reading) {
      this.again = true;
      return;
    }
    void this.drain();
  }

  /** Stop reporting. A read already in flight is finished but not delivered. */
  stop(): void {
    this.stopped = true;
  }

  private async drain(): Promise<void> {
    this.reading = true;
    try {
      do {
        this.again = false;
        const snapshot = await this.read();
        if (this.stopped) {
          return;
        }
        this.deliver(snapshot);
      } while (this.again);
    } catch (cause) {
      this.reportFailedRead(cause);
    } finally {
      this.reading = false;
    }
  }

  /**
   * Hand the snapshot over. A listener that throws must not take the
   * subscription down with it — the next change is still worth reporting — so it
   * goes to the log, as an unobserved warning does.
   */
  private deliver(snapshot: JobSnapshot): void {
    try {
      this.listener(snapshot);
    } catch (cause) {
      console.warn(`[ace-studio] a job progress listener threw: ${describeCause(cause)}`);
    }
  }

  /**
   * A re-read that failed. The subscription survives it: a transient refusal
   * should not silently end the watch, and the next change reads again. A closed
   * connection is the exception — nothing will arrive to read again on.
   */
  private reportFailedRead(cause: unknown): void {
    if (isCode(cause, "BRIDGE_UNREACHABLE")) {
      this.stopped = true;
      return;
    }
    const code = isBridgeError(cause) ? cause.code : "unknown";
    console.warn(`[ace-studio] could not re-read job '${this.id}' after a change: ${code}`);
  }
}

/** Milliseconds since a mark. */
function elapsed(since: number): number {
  return Date.now() - since;
}

/**
 * Hold for `ms` before the next poll, cutting the wait short if the caller
 * aborts. A zero or negative wait is no wait at all — the host already spent the
 * interval holding the call.
 */
async function pause(ms: number, signal: AbortSignal | undefined, id: string): Promise<void> {
  if (ms <= 0) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const done = (): void => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };
    const onAbort = (): void => {
      done();
      reject(waitAborted(id));
    };
    const timer = setTimeout(() => {
      done();
      resolve();
    }, ms);
    // A job nobody is waiting on any more must not hold the process open.
    timer.unref?.();
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * The refusal an aborted wait raises. Same code as any other expired local wait,
 * with the reassurance that matters here: the job is still running, because
 * disconnection is never cancellation (ADR 0084).
 */
function waitAborted(id: string): BridgeError<"TIMEOUT"> {
  return new BridgeError({
    code: "TIMEOUT",
    message: `The wait for job '${id}' was aborted.`,
    hint: "the job is untouched — aborting a wait never cancels it, only 'job cancel' does",
  });
}
