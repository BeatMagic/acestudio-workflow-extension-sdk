/**
 * Per-op call options (ADR 0094 §8): what each class of operation will and will
 * not let a caller ask for.
 *
 * The first half is checked by `tsc`, not by vitest. The guarantee is that the
 * wrong option *does not compile*, so the assertions are `@ts-expect-error` lines
 * inside a function nothing calls — the typecheck reads them, the test run never
 * executes them, and an option that becomes wrongly legal fails `npm run
 * typecheck`. The vitest blocks below cover what a type cannot: pure type
 * relations worth naming, and the caller `tsc` never sees — plain JavaScript, or
 * TypeScript that cast its way past the option type.
 */

import { describe, expect, expectTypeOf, it } from "vitest";
import {
  connect,
  createTransportPair,
  isCode,
  OPERATIONS,
  type CallOptions,
  type ClipNoteContentResult,
  type Fingerprint,
  type MutatingCallOptions,
  type PreconditionCallOptions,
  type PublicBindings,
  type TransportLoopResult,
} from "@timedomain/acestudio-bridge-core";
import { ScriptedHostPeer, type ScriptedHostOptions } from "./support/host-peer.js";

/**
 * Every option a caller may and may not pass, as call sites the compiler checks.
 *
 * Never invoked — `client` and the two read results are declarations, and calling
 * this would dereference them. The point is the diagnostics, and an
 * `@ts-expect-error` that stops being an error fails the build.
 */
function optionsThatCompile(
  client: PublicBindings,
  /** A fingerprint as a caller legitimately comes by one: off a read's result. */
  readLoop: TransportLoopResult,
  readNotes: ClipNoteContentResult,
): void {
  // A read: the local-wait options, and neither guardrail. `waitBusy` is about
  // the busy gate, which only runs for a mutating dispatch; `ifMatch` is checked
  // only on a write.
  void client.transport.loop({ timeoutMs: 500, signal: AbortSignal.timeout(500) });
  // @ts-expect-error -- a read has no busy gate to wait on
  void client.transport.loop({ waitBusy: 1_000 });
  // @ts-expect-error -- a read overwrites nothing to be stale against
  void client.transport.loop({ ifMatch: readLoop.fingerprint });

  // A mutating call: the busy gate, and no further. `track rename` registers no
  // fingerprint computer with the host, so a token carried into it would be
  // accepted and ignored — an unguarded write that reads as guarded. That last
  // line is the one this ticket exists to make impossible.
  void client.track.rename({ trackIndex: 0, newName: "Verse" }, { waitBusy: 2_500, timeoutMs: 5_000 });
  // @ts-expect-error -- `track rename` does not check a fingerprint
  void client.track.rename({ trackIndex: 0, newName: "Verse" }, { ifMatch: readLoop.fingerprint });

  // A guarded write: `ifMatch` too. Every `note` write shares the
  // clip-note-content token `clip note-content` hands out, so the read that
  // produces one and the writes that consume it are a matched pair across two
  // domains.
  void client.transport.setLoop({ startTick: 0, endTick: 3_840 }, { ifMatch: readLoop.fingerprint, waitBusy: 500 });
  void client.note.move({ noteUuids: ["{a}"], pos: 960 }, { ifMatch: readNotes.fingerprint });

  // A forged fingerprint: a literal is not one, however plausible it looks.
  // @ts-expect-error -- the brand is what keeps it obtainable only from a read
  const forged: Fingerprint = "1:9f86d081884c7d65";
  void forged;

  // `new` is a method, not a construct signature. Written bare in an interface it
  // is the latter, which contributes no member at all — so this one line is the
  // test: it did not compile until the emitter learned to quote the name, even
  // though the runtime binding was there and callable the whole time.
  void client.project.new({ discardChanges: true }, { waitBusy: 1_000 });
}

describe("the three option types", () => {
  it("are a strict widening chain, each adding exactly one option", () => {
    expectTypeOf<PreconditionCallOptions>().toExtend<MutatingCallOptions>();
    expectTypeOf<MutatingCallOptions>().toExtend<CallOptions>();

    // The part that matters is the negative: the step below does not already
    // carry the option the step above adds.
    expectTypeOf<CallOptions>().not.toHaveProperty("waitBusy");
    expectTypeOf<MutatingCallOptions>().toHaveProperty("waitBusy");
    expectTypeOf<MutatingCallOptions>().not.toHaveProperty("ifMatch");
    expectTypeOf<PreconditionCallOptions>().toHaveProperty("ifMatch");

    // And `signal`/`timeoutMs` are on the narrowest, so every call has them.
    expectTypeOf<CallOptions>().toHaveProperty("timeoutMs");
    expectTypeOf<CallOptions>().toHaveProperty("signal");
  });

  it("type `ifMatch` as the opaque fingerprint, not a string", () => {
    expectTypeOf<TransportLoopResult["fingerprint"]>().toEqualTypeOf<Fingerprint>();
    expectTypeOf<ClipNoteContentResult["fingerprint"]>().toEqualTypeOf<Fingerprint>();
    expectTypeOf<Fingerprint>().toExtend<string>();
    // A fingerprint is a string; a string is not a fingerprint.
    expectTypeOf<string>().not.toEqualTypeOf<Fingerprint>();
  });
});

describe("the descriptor rows behind all of it", () => {
  it("declares a precondition only on mutating operations, and only where the host checks one", () => {
    // The generator's rule, asserted against the real table:
    // `fingerprintPrecondition` is a narrowing of `mutating`, never a second
    // independent flag. The list is spelled out rather than derived, so a write
    // that gains or loses the host's fingerprint gate has to be acknowledged
    // here — expect to edit this when the catalog grows one.
    expect(OPERATIONS.filter((operation) => !operation.mutating && operation.fingerprintPrecondition)).toEqual([]);
    expect(OPERATIONS.filter((operation) => operation.fingerprintPrecondition).map((operation) => operation.path)).toEqual([
      "clip replace-content",
      "fx apply-preset",
      "fx set-param",
      "note add",
      "note delete",
      "note move",
      "note resize",
      "note set-articulation",
      "note set-lyric",
      "note split",
      "tempo remove-point",
      "tempo set",
      "tempo set-point",
      "timesig remove-at",
      "timesig set",
      "timesig set-at",
      "transport set-loop",
      "vocalparam write",
    ]);
  });
});

describe("an untyped caller's ifMatch", () => {
  async function connectToScriptedHost(options: ScriptedHostOptions) {
    const { client: clientTransport, host: hostTransport } = createTransportPair();
    const host = new ScriptedHostPeer(hostTransport, options);
    const connection = await connect({ transport: clientTransport, authToken: "token-abc" });
    return { connection, host };
  }

  it("is refused rather than sent to a write that would ignore it", async () => {
    const { connection, host } = await connectToScriptedHost({
      grantedTokens: ["track.write"],
      operations: { "track rename": { data: {} } },
    });

    // What plain JavaScript, or an `as never` cast, can still do. Forwarding it
    // would be worse than refusing: the host accepts a token for an op that
    // never opted into the gate and ignores it, so the write would look guarded.
    const rename = connection.client.track.rename as (params: unknown, options?: unknown) => Promise<void>;
    await expect(rename({ trackIndex: 0, newName: "Verse" }, { ifMatch: "1:deadbeef" })).rejects.toSatisfy(
      (error: unknown) => isCode(error, "INVALID_ARG"),
    );

    // And the call never happened: a refused precondition is not something the
    // host got to see, let alone act on.
    expect(host.invocations).toEqual([]);
    connection.close();
  });

  it("reaches the host on a write that does check it", async () => {
    const { connection, host } = await connectToScriptedHost({
      grantedTokens: ["transport.control"],
      operations: { "transport set-loop": { data: {} } },
    });

    const setLoop = connection.client.transport.setLoop as (params: unknown, options?: unknown) => Promise<void>;
    await setLoop({ startTick: 0 }, { ifMatch: "1:deadbeef" });

    expect(host.invocations[0]?.arguments).toEqual({ startTick: 0, fingerprint: "1:deadbeef" });
    connection.close();
  });
});
