/**
 * A scripted stand-in for the Studio's job ledger (ADR 0084).
 *
 * It answers the five `job` operations a handle rides on — `get`, `wait`,
 * `results`, `cancel`, `list` — out of in-memory job objects, and pushes the
 * `jobs` change channel when one moves. The payload types come from the generated
 * bindings, so a schema change breaks this ledger at compile time rather than
 * letting the tests drift away from the wire.
 *
 * The two behaviours worth stating, because a handle's whole contract rests on
 * them: `wait` answers with `{done, finished, jobs}` — the same structured
 * "still running / finished" shape ADR 0092 §5 gives the MCP long-poll — either
 * at once, or held until the condition is met when the ledger is built to hold
 * (both are hosts a handle has to work against); and nothing here ever cancels a
 * job on a wait expiring, because the ledger never does either.
 */

import type {
  JobCancelParams,
  JobGetParams,
  JobGetResult,
  JobListResult,
  JobResultsParams,
  JobResultsResult,
  JobWaitParams,
  JobWaitResult,
} from "@timedomain/acestudio-bridge-core";
import type { ScriptedHostPeer, ScriptedOperation, ScriptedOperationHandler } from "./host-peer.js";

/** The change channel the ledger reports on, as the notification envelope spells it. */
const JOBS_CHANNEL = "jobs";

/** A job as the ledger holds it — the wire snapshot, and nothing besides. */
export type ScriptedJob = JobGetResult;

/** The lifecycles a job never leaves once it reaches them. */
const TERMINAL = new Set<ScriptedJob["lifecycle"]>(["succeeded", "failed", "cancelled"]);

/** A job with the fields a test does not care about already filled in. */
export function scriptedJob(job: Partial<ScriptedJob> & Pick<ScriptedJob, "id">): ScriptedJob {
  return {
    cancelable: true,
    delivery: "staged",
    hasProgress: true,
    jobClass: "stem-split",
    launcher: "extension",
    launcherLabel: "test-extension",
    lifecycle: "running",
    results: [],
    streamingCapable: false,
    ...job,
  };
}

/** How a scripted ledger answers `job wait`. */
export interface ScriptedLedgerOptions {
  /**
   * Hold a `wait` whose condition is not met yet, releasing it when the job
   * moves — the long-polling host of ADR 0092 §5. Left off, every wait answers
   * at once and a caller that keeps waiting re-issues it, which is the other
   * host a handle has to be right against.
   */
  holdWaits?: boolean;
  /**
   * Release a held wait this many milliseconds *before* the bound it was given,
   * modelling a host whose hold timer fires a hair early. Node's do, a fraction of
   * a percent of the time, and a real host's are equally free to — so this makes
   * that arrival deterministic rather than something a test waits to be unlucky
   * about. Left off, a hold runs to its bound.
   */
  holdShortfallMs?: number;
}

/** One `job wait` the ledger is holding until the jobs it named finish. */
interface HeldWait {
  params: JobWaitParams;
  release: (answer: ScriptedOperation) => void;
  /** The bound the caller sent, once it is armed; absent on an unbounded hold. */
  expiry?: ReturnType<typeof setTimeout>;
}

/** The ledger behind a scripted host: the jobs, and the ops that project them. */
export class ScriptedJobLedger {
  private readonly jobs = new Map<string, ScriptedJob>();
  private readonly holding = new Set<HeldWait>();
  private readonly options: ScriptedLedgerOptions;
  private host: ScriptedHostPeer | undefined;

  constructor(jobs: readonly ScriptedJob[] = [], options: ScriptedLedgerOptions = {}) {
    this.options = options;
    for (const job of jobs) {
      this.jobs.set(job.id, job);
    }
  }

  /**
   * The operation table to hand the scripted host. `job place` and `job
   * discard-result` are absent: they act on the *project*, not on a handle, and a
   * test that needs them scripts them itself.
   */
  operations(): Readonly<Record<string, ScriptedOperationHandler>> {
    return {
      "job get": (params) => this.answerGet(params.arguments as unknown as JobGetParams),
      "job list": () => ({ data: { jobs: [...this.jobs.values()] } satisfies JobListResult }),
      "job results": (params) => this.answerResults(params.arguments as unknown as JobResultsParams),
      "job wait": (params) => this.answerWait(params.arguments as unknown as JobWaitParams),
      "job cancel": (params) => this.answerCancel(params.arguments as unknown as JobCancelParams),
    };
  }

  /** Wire the ledger to the host it answers through, so a move can be announced. */
  attach(host: ScriptedHostPeer): this {
    this.host = host;
    return this;
  }

  /** The job as the ledger currently holds it. */
  job(id: string): ScriptedJob {
    const job = this.jobs.get(id);
    if (job === undefined) {
      throw new Error(`the scripted ledger holds no job '${id}'`);
    }
    return job;
  }

  /**
   * Move a job on and announce it, as a producer's registration seam does. The
   * announcement carries the job id in `changes` and nothing else — the channel
   * is a hint to re-read, so a listener that wants the new state has to ask.
   */
  advance(id: string, patch: Partial<ScriptedJob>): ScriptedJob {
    const moved = { ...this.job(id), ...patch };
    this.jobs.set(id, moved);
    this.releaseSatisfiedWaits();
    this.host?.notifyChange(JOBS_CHANNEL, [id]);
    return moved;
  }

  /** Answer every held wait whose condition the move just satisfied. */
  private releaseSatisfiedWaits(): void {
    for (const held of [...this.holding]) {
      const answer = this.pollWait(held.params);
      if (answer.done) {
        this.holding.delete(held);
        clearTimeout(held.expiry);
        held.release({ data: answer });
      }
    }
  }

  private answerGet(params: JobGetParams): ScriptedOperation {
    const job = this.jobs.get(params.id);
    return job === undefined
      ? { fault: { code: -32004, message: `no such job: ${params.id}`, data: { code: "NOT_FOUND" } } }
      : { data: job satisfies JobGetResult };
  }

  private answerResults(params: JobResultsParams): ScriptedOperation {
    const job = this.jobs.get(params.id);
    return job === undefined
      ? { fault: { code: -32004, message: `no such job: ${params.id}`, data: { code: "NOT_FOUND" } } }
      : { data: { results: job.results } satisfies JobResultsResult };
  }

  /**
   * One poll, held or not: which of the named jobs have reached a terminal
   * lifecycle, and whether that satisfies the caller's condition. A holding
   * ledger keeps an unsatisfied poll open until a move satisfies it — or until
   * the bound the caller sent runs out, whichever comes first. The bound expiring
   * is an *answer*, `done: false` over the jobs as they stand: a long poll that
   * outstayed its welcome is not a fault, and never a cancellation (ADR 0092 §5).
   */
  private answerWait(params: JobWaitParams): ScriptedOperation | Promise<ScriptedOperation> {
    const answer = this.pollWait(params);
    if (answer.done || this.options.holdWaits !== true) {
      return { data: answer };
    }
    return new Promise<ScriptedOperation>((resolve) => {
      const held: HeldWait = { params, release: resolve };
      this.holding.add(held);
      if (typeof params.timeoutMs !== "number") {
        return;
      }
      // Clamped, so the knob can only do what its name says: a negative shortfall would
      // hold *past* the bound, which is a different host and not this one.
      const shortfall = Math.max(0, this.options.holdShortfallMs ?? 0);
      held.expiry = setTimeout(
        () => {
          this.holding.delete(held);
          held.release({ data: this.pollWait(params) });
        },
        Math.max(0, params.timeoutMs - shortfall),
      );
      held.expiry.unref?.();
    });
  }

  /**
   * The wait condition, evaluated against the ledger as it stands. An id the
   * ledger does not hold raises rather than being dropped from `jobs`: the schema
   * promises a snapshot of *each* waited-on job and declares no answer for an id
   * that has none, so omitting it would hang the wait on a condition that can
   * never be met, and faulting would put semantics on the wire the host has not
   * promised. Raising says what it is — a script waiting on a job it never staged.
   */
  private pollWait(params: JobWaitParams): JobWaitResult {
    const jobs = params.ids.map((id) => this.job(id));
    const finished = jobs.filter((job) => TERMINAL.has(job.lifecycle));
    return {
      done: params.any ? finished.length > 0 : finished.length === params.ids.length,
      finished: finished.map((job) => job.id),
      jobs,
    };
  }

  /**
   * Cancel, with the ledger's honesty about it: a class that declares itself
   * non-cancellable answers the stable code rather than pretending (ADR 0084).
   */
  private answerCancel(params: JobCancelParams): ScriptedOperation {
    const job = this.jobs.get(params.id);
    if (job === undefined) {
      return { fault: { code: -32004, message: `no such job: ${params.id}`, data: { code: "NOT_FOUND" } } };
    }
    if (!job.cancelable) {
      return {
        fault: {
          code: -32005,
          message: `job class '${job.jobClass}' cannot be cancelled`,
          data: { code: "JOB_NOT_CANCELLABLE" },
        },
      };
    }
    this.advance(job.id, { lifecycle: "cancelled" });
    return { data: null };
  }
}
