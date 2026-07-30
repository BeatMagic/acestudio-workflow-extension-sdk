/**
 * `JobHandle` over the `job.*` contract (ADR 0094 §6): what a consumer sees of a
 * long-running job, and the wire traffic that produced it.
 *
 * Every test drives the real stack over an in-memory transport pair against the
 * scripted host peer and its job ledger. The recurring assertion is on
 * `host.invocations`: a handle is *sugar* over `client.job.*`, so every method
 * has to show up on the wire as the job verb a consumer could have called by hand
 * — one wire contract, no second one hiding behind the ergonomics.
 */

import { describe, expect, it } from "vitest";
import {
  connect,
  createTransportPair,
  isCode,
  type BridgeConnection,
  type CapabilityToken,
  type JobHandle,
  type JobSnapshot,
} from "@timedomain/acestudio-bridge-core";
// Reached by path, not through the package entry: the binding runtime's table
// seam and the job-class table are @internal, and the generated surface declares
// no job-class operation to drive them with.
import { buildBindings } from "../src/bindings.js";
import { JOB_CLASS_OPERATIONS, type JobClassTable } from "../src/jobs.js";
import { ScriptedHostPeer } from "./support/host-peer.js";
import { ScriptedJobLedger, scriptedJob } from "./support/job-ledger.js";

async function connectToLedger(
  ledger: ScriptedJobLedger,
  grantedTokens: readonly CapabilityToken[] = ["job.read", "job.control"],
): Promise<{ connection: BridgeConnection; host: ScriptedHostPeer }> {
  const { client, host: hostTransport } = createTransportPair();
  const host = new ScriptedHostPeer(hostTransport, { grantedTokens, operations: ledger.operations() });
  ledger.attach(host);
  const connection = await connect({ transport: client, authToken: "token-abc" });
  return { connection, host };
}

/**
 * Yield long enough for the stack to get on with it — a poll loop to go round
 * before the ledger moves, or a pushed change and the re-read it provokes to
 * land. Neither has a response a test can await: the change is a notification,
 * and the loop is nobody's promise until it resolves.
 */
async function settle(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));
}

describe("waiting on a job", () => {
  it("polls the ledger and resolves finished once the job reaches a terminal lifecycle", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running", progress: 0.25 })]);
    const { connection, host } = await connectToLedger(ledger);

    // The wait is issued while the job is still running, so the first poll comes
    // back `done: false` and the handle re-issues it — the long-poll loop ADR
    // 0092 §5 describes, run by the SDK instead of by hand.
    const waiting = connection.job("job-42").wait({ pollIntervalMs: 1 });
    await settle();
    ledger.advance("job-42", { lifecycle: "succeeded", progress: 1 });
    const outcome = await waiting;

    expect(outcome.status).toBe("finished");
    expect(outcome.job.lifecycle).toBe("succeeded");
    expect(outcome.job.progress).toBe(1);

    // Sugar and nothing else: every round trip was `job wait`, the same call a
    // consumer holding only `client.job.*` would have made.
    expect(new Set(host.invocations.map((invocation) => invocation.path))).toEqual(new Set(["job wait"]));
    expect(host.invocations.length).toBeGreaterThan(1);
    expect(host.invocations[0]?.arguments).toMatchObject({ ids: ["job-42"], any: false });
    connection.close();
  });

  it("answers a bounded wait that expires with a timeout outcome, leaving the job running", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running", progress: 0.5 })]);
    const { connection, host } = await connectToLedger(ledger);

    // The distinction the CLI spends exit code 4 on: the wait gave up, the job
    // did not. An expiry is an outcome to read, not an error to catch.
    const outcome = await connection.job("job-42").wait({ timeoutMs: 20, pollIntervalMs: 1 });

    expect(outcome.status).toBe("timeout");
    expect(outcome.job.lifecycle).toBe("running");
    expect(outcome.job.progress).toBe(0.5);

    // And the job is untouched: waiting only observes, so nothing that stops work
    // went out — least of all the cancel a "timeout means give up" reading would
    // have invited.
    expect(ledger.job("job-42").lifecycle).toBe("running");
    expect(host.invocations.map((invocation) => invocation.path)).not.toContain("job cancel");
    connection.close();
  });

  it("carries the caller's remaining budget into each poll, so a long-polling host holds no longer", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running" })]);
    const { connection, host } = await connectToLedger(ledger);

    await connection.job("job-42").wait({ timeoutMs: 40, pollIntervalMs: 1 });

    // Every poll's own bound is what is left of the caller's, never the whole of
    // it: a host that held each call for the full 40ms would outlast the wait by
    // a poll every time.
    const bounds = host.invocations.map((invocation) => (invocation.arguments as { timeoutMs?: number }).timeoutMs ?? 0);
    expect(bounds[0]).toBeLessThanOrEqual(40);
    expect(bounds.at(-1)).toBeLessThan(bounds[0] ?? 0);
    connection.close();
  });

  it("aborts on the caller's signal without touching the job", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running" })]);
    const { connection, host } = await connectToLedger(ledger);
    const controller = new AbortController();

    const waiting = connection.job("job-42").wait({ signal: controller.signal, pollIntervalMs: 50 });
    await settle();
    controller.abort();

    // An abort is the caller changing their mind mid-wait, so it raises rather
    // than resolving — the one thing it does not do is stop the work.
    await expect(waiting).rejects.toSatisfy((error: unknown) => isCode(error, "TIMEOUT"));
    expect(ledger.job("job-42").lifecycle).toBe("running");
    expect(host.invocations.map((invocation) => invocation.path)).not.toContain("job cancel");
    connection.close();
  });

  it("reports a job that finished while the loop was waiting to ask again as finished", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running" })]);
    const { connection } = await connectToLedger(ledger);

    // The job settles inside the last nap: after the poll at 300ms, before the
    // bound at 400ms. Deciding "timed out" from the poll *before* that nap would
    // report a false negative — the work finished inside the window the caller
    // asked about, and nobody looked.
    setTimeout(() => ledger.advance("job-42", { lifecycle: "succeeded" }), 320);
    const outcome = await connection.job("job-42").wait({ timeoutMs: 400, pollIntervalMs: 300 });

    expect(outcome.status).toBe("finished");
    expect(outcome.job.lifecycle).toBe("succeeded");
    connection.close();
  });
});

describe("waiting against a host that holds the poll", () => {
  it("spends one call on a long-poll the host answers when the job finishes", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running" })], { holdWaits: true });
    const { connection, host } = await connectToLedger(ledger);

    // The host of ADR 0092 §5: it holds the call rather than answering "still
    // running", so the loop's poll interval never comes into it and the whole
    // wait costs one round trip.
    const waiting = connection.job("job-42").wait();
    await settle();
    ledger.advance("job-42", { lifecycle: "succeeded" });

    expect(await waiting).toMatchObject({ status: "finished" });
    expect(host.invocations.filter((invocation) => invocation.path === "job wait")).toHaveLength(1);
    connection.close();
  });

  it("answers a bound the host held all the way to with a timeout outcome", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running" })], { holdWaits: true });
    const { connection, host } = await connectToLedger(ledger);

    // The caller's bound goes out as the hold's own bound, so the host answers
    // "still running" at the deadline rather than being cut off at it. What comes
    // back is the outcome, not the BridgeError a call outrunning its local
    // deadline would raise — and the whole wait still costs one round trip.
    const outcome = await connection.job("job-42").wait({ timeoutMs: 80 });

    expect(outcome).toMatchObject({ status: "timeout", job: { lifecycle: "running" } });
    expect(host.invocations.filter((invocation) => invocation.path === "job wait")).toHaveLength(1);
    connection.close();
  });
});

describe("watching a job", () => {
  it("hands the listener a fresh snapshot each time the ledger reports the job moved", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "queued", progress: 0 })]);
    const { connection, host } = await connectToLedger(ledger);
    const seen: JobSnapshot[] = [];

    const stop = connection.job("job-42").onProgress((snapshot) => seen.push(snapshot));
    ledger.advance("job-42", { lifecycle: "running", progress: 0.4 });
    await settle();
    ledger.advance("job-42", { lifecycle: "succeeded", progress: 1 });
    await settle();

    // The change channel is a hint to re-read, never the new state (ADR 0083
    // §2.4) — so what a listener gets is the snapshot behind the hint, and the
    // re-read it took is on the wire as the `job get` a consumer would have made.
    expect(seen.map((snapshot) => snapshot.progress)).toEqual([0.4, 1]);
    expect(seen.map((snapshot) => snapshot.lifecycle)).toEqual(["running", "succeeded"]);
    expect(host.invocations.filter((invocation) => invocation.path === "job get")).toHaveLength(2);

    // Unsubscribing is final: a change after it costs neither a callback nor a
    // round trip.
    stop();
    ledger.advance("job-42", { lifecycle: "failed" });
    await settle();
    expect(seen).toHaveLength(2);
    expect(host.invocations.filter((invocation) => invocation.path === "job get")).toHaveLength(2);
    connection.close();
  });

  it("ignores a change that names other jobs", async () => {
    const ledger = new ScriptedJobLedger([
      scriptedJob({ id: "job-42", lifecycle: "running" }),
      scriptedJob({ id: "job-43", lifecycle: "running" }),
    ]);
    const { connection, host } = await connectToLedger(ledger);
    const seen: JobSnapshot[] = [];

    const stop = connection.job("job-42").onProgress((snapshot) => seen.push(snapshot));
    // One channel carries the whole ledger, so a handle sees every job's changes
    // and has to read `changes` to know which are its own. Re-reading on someone
    // else's is a round trip per job in the session, per event.
    ledger.advance("job-43", { lifecycle: "succeeded" });
    await settle();

    expect(seen).toEqual([]);
    expect(host.invocations.filter((invocation) => invocation.path === "job get")).toHaveLength(0);
    stop();
    connection.close();
  });

  it("refuses the subscription locally when the grant cannot read the ledger", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42" })]);
    const { connection, host } = await connectToLedger(ledger, ["job.control"]);

    // The failure this guard exists for: without it an ungranted subscription is
    // not an error, it is a callback that never fires — indistinguishable from a
    // job that simply has not moved.
    expect(() => connection.job("job-42").onProgress(() => undefined)).toThrowError(
      expect.objectContaining({ code: "CAPABILITY_DENIED" }),
    );
    expect(host.invocations).toEqual([]);
    connection.close();
  });
});

describe("a job's result children", () => {
  it("retrieves the staged results, each with its own settling state", async () => {
    const ledger = new ScriptedJobLedger([
      scriptedJob({
        id: "job-42",
        delivery: "staged",
        lifecycle: "succeeded",
        results: [
          { id: "result-1", state: "settled" },
          { id: "result-2", state: "failed" },
        ],
      }),
    ]);
    const { connection, host } = await connectToLedger(ledger);

    // Staged delivery is the whole reason retrieval is a step: the results are in
    // session history, and placing one is a separate `job place` the caller makes
    // when it decides where it goes.
    const results = await connection.job("job-42").result();

    expect(results).toEqual([
      { id: "result-1", state: "settled" },
      { id: "result-2", state: "failed" },
    ]);
    expect(host.invocations.map((invocation) => invocation.path)).toEqual(["job results"]);
    expect(host.invocations[0]?.arguments).toEqual({ id: "job-42" });
    connection.close();
  });
});

describe("cancelling a job", () => {
  it("stops a cancellable job through the ledger's own verb", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", cancelable: true, lifecycle: "running" })]);
    const { connection, host } = await connectToLedger(ledger);

    await connection.job("job-42").cancel();

    expect(ledger.job("job-42").lifecycle).toBe("cancelled");
    expect(host.invocations.map((invocation) => invocation.path)).toEqual(["job cancel"]);
    expect(host.invocations[0]?.arguments).toEqual({ id: "job-42" });
    connection.close();
  });

  it("passes on the ledger's refusal for a class that cannot be cancelled", async () => {
    const ledger = new ScriptedJobLedger([
      scriptedJob({ id: "job-42", jobClass: "song-generate", cancelable: false, lifecycle: "running" }),
    ]);
    const { connection } = await connectToLedger(ledger);

    // Honest cancel (ADR 0084): a server-side job says so with a stable code
    // rather than pretending to stop. The handle adds nothing to that — no
    // local guess at cancelability, no swallowing the refusal.
    await expect(connection.job("job-42").cancel()).rejects.toSatisfy((error: unknown) =>
      isCode(error, "JOB_NOT_CANCELLABLE"),
    );
    expect(ledger.job("job-42").lifecycle).toBe("running");
    connection.close();
  });

  it("refuses locally when the grant cannot control the ledger", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42" })]);
    const { connection, host } = await connectToLedger(ledger, ["job.read"]);

    await expect(connection.job("job-42").cancel()).rejects.toSatisfy((error: unknown) =>
      isCode(error, "CAPABILITY_DENIED"),
    );
    expect(host.invocations).toEqual([]);
    connection.close();
  });
});

describe("a job-class operation", () => {
  /**
   * A client whose job-class table is a fixture. No catalog operation declares a
   * job class yet — the generative group that will is not on the public surface —
   * so `track rename` stands in for a launch op, and everything else in the stack
   * is the shipping one: real peer, real grant, real scripted host.
   */
  async function clientWithJobClasses(jobClasses: JobClassTable, ledger: ScriptedJobLedger, launched: unknown) {
    const { client: clientTransport, host: hostTransport } = createTransportPair();
    const host = new ScriptedHostPeer(hostTransport, {
      grantedTokens: ["job.read", "job.control", "track.write"],
      operations: { ...ledger.operations(), "track rename": { data: launched } },
    });
    ledger.attach(host);
    const connection = await connect({ transport: clientTransport, authToken: "token-abc" });
    const client = buildBindings(
      connection.peer,
      connection.grant,
      () => undefined,
      () => undefined,
      { params: {}, result: {} },
      jobClasses,
    ) as { track: { rename(params: unknown, options?: unknown): Promise<unknown> } };
    return { client, host, connection };
  }

  const LAUNCHES: JobClassTable = { "track rename": { jobClass: "stem-split", idField: "jobId" } };

  it("resolves on acceptance with a handle, while the job is still running", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-77", jobClass: "stem-split", lifecycle: "running" })]);
    const { client, host, connection } = await clientWithJobClasses(LAUNCHES, ledger, { jobId: "job-77" });

    const handle = (await client.track.rename({ trackIndex: 0, newName: "Verse" })) as JobHandle;

    // Acceptance, not completion: the call came back with the ledger's id while
    // the work is still running, which is the whole of async-by-default. A
    // launch that resolved on completion would have had to wait for this.
    expect(handle.id).toBe("job-77");
    expect(ledger.job("job-77").lifecycle).toBe("running");
    expect(host.invocations.map((invocation) => invocation.path)).toEqual(["track rename"]);

    // And it is a handle over the same wire contract, so observing it from here
    // is the `job` group and nothing else.
    ledger.advance("job-77", { lifecycle: "succeeded" });
    const outcome = await handle.wait({ pollIntervalMs: 1 });
    expect(outcome.status).toBe("finished");
    expect(host.invocations.map((invocation) => invocation.path)).toEqual(["track rename", "job wait"]);
    connection.close();
  });

  it("refuses an acceptance that named no job", async () => {
    const ledger = new ScriptedJobLedger([]);
    const { client, connection } = await clientWithJobClasses(LAUNCHES, ledger, { accepted: true });

    // A job-producing operation always returns a job id (ADR 0084). Without one
    // there is nothing to wait on, cancel, or retrieve — so this fails loudly
    // rather than handing back a handle addressed to `undefined`.
    await expect(client.track.rename({ trackIndex: 0, newName: "Verse" })).rejects.toSatisfy((error: unknown) =>
      isCode(error, "MALFORMED_PAYLOAD"),
    );
    connection.close();
  });

  it("declares no job class for any operation on today's public surface", () => {
    // Which is why every test above hands in a fixture table: the launch path is
    // inert in a shipping build, and this is the assertion that says so out loud
    // rather than leaving the empty table looking like an oversight. It goes when
    // the catalog declares its first job class.
    expect(JOB_CLASS_OPERATIONS).toEqual({});
  });
});

describe("a handle beside the wire contract it sugars", () => {
  it("issues exactly the calls a consumer would make by hand through client.job.*", async () => {
    const ledger = new ScriptedJobLedger([
      scriptedJob({ id: "job-42", launcher: "ui", lifecycle: "succeeded", results: [{ id: "r-1", state: "settled" }] }),
    ]);
    const { connection, host } = await connectToLedger(ledger);

    // The job was launched by the user's UI, not by this session — attributed
    // session-wide visibility is what makes a handle for it meaningful at all.
    await connection.client.job.wait({ ids: ["job-42"], any: false });
    await connection.client.job.results({ id: "job-42" });
    await connection.client.job.cancel({ id: "job-42" });
    const byHand = [...host.invocations];
    host.invocations.length = 0;

    const handle = connection.job("job-42");
    await handle.wait();
    await handle.result();
    await handle.cancel();

    // Byte for byte the same invocations: the handle is an ergonomic surface over
    // the job group, not a second contract with its own wire shape.
    expect(host.invocations).toEqual(byHand);
    connection.close();
  });
});

describe("the poll interval beside the wait's bound", () => {
  it("never naps past the bound, however long the interval is", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running" })]);
    const { connection } = await connectToLedger(ledger);

    // A 500ms floor on re-asking, inside a 60ms bound: the interval says how
    // eagerly to poll a host that answers at once, and is never a reason to
    // outstay the caller.
    const startedAt = Date.now();
    const outcome = await connection.job("job-42").wait({ timeoutMs: 60, pollIntervalMs: 500 });

    expect(outcome.status).toBe("timeout");
    expect(Date.now() - startedAt).toBeLessThan(400);
    connection.close();
  });

  it("falls back to the default floor when the interval is not an interval", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running" })]);
    const { connection, host } = await connectToLedger(ledger);

    // A parsed configuration value that came out NaN must not read as "no floor":
    // against a host that answers at once, that is a poll loop spinning as fast as
    // the transport allows, for as long as the caller waits.
    const outcome = await connection.job("job-42").wait({ timeoutMs: 120, pollIntervalMs: Number.NaN });

    expect(outcome.status).toBe("timeout");
    expect(host.invocations.length).toBeLessThanOrEqual(3);
    connection.close();
  });

  it("refuses a bound that is not a bound rather than waiting on it", async () => {
    const ledger = new ScriptedJobLedger([scriptedJob({ id: "job-42", lifecycle: "running" })]);
    const { connection, host } = await connectToLedger(ledger);

    // The interval has a default to fall back to; a bound does not — "no bound"
    // means waiting forever, which is the one thing a caller who passed one did
    // not ask for. So this is refused, before a single poll goes out.
    await expect(connection.job("job-42").wait({ timeoutMs: Number.NaN })).rejects.toSatisfy((error: unknown) =>
      isCode(error, "INVALID_ARG"),
    );

    expect(host.invocations).toHaveLength(0);
    connection.close();
  });
});
