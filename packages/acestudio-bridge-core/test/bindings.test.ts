/**
 * The generated bindings on a connection: the grant they check, the refusal they
 * raise without spending a round trip, and the round trip when they do spend it.
 *
 * The whole file drives the real stack over an in-memory transport pair against
 * the scripted host peer — nothing here mocks the layer under test.
 */

import { describe, expect, expectTypeOf, it, vi } from "vitest";
import {
  connect,
  createTransportPair,
  isBridgeError,
  isCode,
  OPERATIONS,
  PROFILES,
  REQUIRED_TOKENS,
  type BridgeConnection,
  type CapabilityToken,
  type InvokeParams,
  type TrackListResult,
} from "@timedomain/acestudio-bridge-core";
import { HOST_INVOKE, ScriptedHostPeer, type ScriptedHostOptions } from "./support/host-peer.js";

async function connectToScriptedHost(
  options: ScriptedHostOptions = {},
): Promise<{ connection: BridgeConnection; host: ScriptedHostPeer }> {
  const { client, host: hostTransport } = createTransportPair();
  const host = new ScriptedHostPeer(hostTransport, options);
  const connection = await connect({ transport: client, authToken: "token-abc" });
  return { connection, host };
}

/** One scripted `track list` answer, shaped by the generated result type. */
const TRACKS: TrackListResult = {
  contentTrackCount: 1,
  tracks: [{ clipCount: 2, trackIndex: 0, trackName: "Lead", trackType: "Sing", trackUuid: "{a}" }],
};

describe("the operation surface", () => {
  it("mirrors the canonical operation tree, one method per operation", async () => {
    const { connection } = await connectToScriptedHost();
    // Spot-check the shape rather than every method: what matters is that the
    // runtime nests by domain and camelCases a hyphenated one the same way the
    // generated interface spells it.
    expect(typeof connection.client.track.list).toBe("function");
    expect(typeof connection.client.specialTracks.show).toBe("function");
    expect(Object.keys(connection.client).length).toBeGreaterThan(0);
    connection.close();
  });

  it("round-trips a granted operation through its binding", async () => {
    const { connection, host } = await connectToScriptedHost({
      grantedTokens: ["track.read"],
      operations: { "track list": { data: TRACKS } },
    });

    // `track list` takes no arguments, so its binding's first parameter is the
    // options object — which is exactly the case a runtime binding by position
    // gets wrong if it assumes every method starts with a payload.
    const result = await connection.client.track.list({ timeoutMs: 1_000 });

    expect(result).toEqual(TRACKS);
    expect(host.invocations).toEqual([{ path: "track list", arguments: {}, waitTimeoutMs: undefined }]);
    connection.close();
  });

  it("carries a mutating call's guardrails where the host reads them", async () => {
    const { connection, host } = await connectToScriptedHost({
      grantedTokens: ["track.write"],
      operations: { "track rename": { data: {} } },
    });

    await connection.client.track.rename(
      { trackIndex: 0, newName: "Verse" },
      // `ifMatch` is opaque, obtainable only from a read result — the cast is
      // this test standing in for that read.
      { waitBusy: 2_500, ifMatch: "fp-1" as never },
    );

    // The busy wait rides the envelope; the fingerprint rides inside `arguments`
    // under the reserved key (ADR 0088 §5). Getting these two the wrong way round
    // is exactly the mistake a scripted caller cannot see.
    expect(host.invocations[0]).toEqual({
      path: "track rename",
      arguments: { trackIndex: 0, newName: "Verse", fingerprint: "fp-1" },
      waitTimeoutMs: 2_500,
    } satisfies InvokeParams);
    connection.close();
  });

  it("calls an ungated operation on a session granted nothing", async () => {
    const { connection, host } = await connectToScriptedHost({
      grantedTokens: [],
      operations: { "convert tick-to-time": { data: { seconds: 1.5 } } },
    });

    // A registry-declared pure function needs no token, so the guard must not
    // invent one for it.
    await expect(connection.client.convert.tickToTime({ tick: 720 })).resolves.toEqual({ seconds: 1.5 });
    expect(host.invocations).toHaveLength(1);
    connection.close();
  });

  it("reports an operation's advisory warnings rather than dropping them", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { connection } = await connectToScriptedHost({
      grantedTokens: ["track.write"],
      operations: {
        "track rename": { data: {}, warnings: [{ code: "NAME_TRUNCATED", hint: "the name was too long" }] },
      },
    });

    await connection.client.track.rename({ trackIndex: 0, newName: "x".repeat(500) });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("NAME_TRUNCATED"));
    warn.mockRestore();
    connection.close();
  });
});

describe("the pre-wire guard", () => {
  it("refuses an ungranted call without sending anything", async () => {
    const { connection, host } = await connectToScriptedHost({ grantedTokens: ["track.read"] });

    await expect(connection.client.track.rename({ trackIndex: 0, newName: "Verse" })).rejects.toSatisfy(
      (error: unknown) => isCode(error, "CAPABILITY_DENIED"),
    );

    // The point of a *pre-wire* guard: the host never heard about it.
    expect(host.invocations).toEqual([]);
    connection.close();
  });

  it("raises the identical error the host would have returned", async () => {
    const { connection, host } = await connectToScriptedHost({ grantedTokens: ["track.read"] });

    const local = await connection.client.track.rename({ trackIndex: 0, newName: "Verse" }).catch((e: unknown) => e);
    // Both errors have to come from *different* sides for the comparison to mean
    // anything: without this, a guard that had stopped refusing would leave the
    // test comparing the host's answer with itself, and passing.
    expect(host.invocations).toEqual([]);
    // The same call again, this time around the guard, so the *host's* gate is
    // what refuses it and the SDK maps its answer back.
    const remote = await connection.peer
      .request(HOST_INVOKE, { path: "track rename", arguments: {} } satisfies InvokeParams)
      .catch((e: unknown) => e);
    expect(host.invocations).toHaveLength(1);

    expect(isBridgeError(local)).toBe(true);
    expect(isBridgeError(remote)).toBe(true);
    if (!isBridgeError(local) || !isBridgeError(remote)) {
      return;
    }
    expect(local.code).toBe(remote.code);
    expect(local.details).toEqual(remote.details);
    expect(local.hint).toBe(remote.hint);
    expect(local.message).toBe(remote.message);
    connection.close();
  });

  it("narrows a denial's details to the tokens the grant is short of", async () => {
    const { connection } = await connectToScriptedHost({ grantedTokens: [] });

    const error = await connection.client.track.list().catch((e: unknown) => e);

    if (!isCode(error, "CAPABILITY_DENIED")) {
      throw new Error("expected a CAPABILITY_DENIED");
    }
    // `isCode` is what narrows `details` to this code's shape, so `missing` is
    // reachable without a cast.
    expect(error.details.missing).toEqual(["track.read"]);
    expect(error.details.token).toBe("track.read");
    connection.close();
  });

  it("checks every gated operation against the table it was generated with", async () => {
    const { connection, host } = await connectToScriptedHost({ grantedTokens: [] });

    // Not a spot-check: every gated operation must refuse locally on an empty
    // grant, which is the only way to know the guard is wired to the table
    // rather than to a handful of paths someone remembered.
    for (const operation of OPERATIONS) {
      if (operation.ungated) {
        continue;
      }
      const domain = (connection.client as unknown as Record<string, Record<string, () => Promise<unknown>>>)[
        operation.domain.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())
      ];
      await expect(domain[operation.method]()).rejects.toSatisfy((error: unknown) =>
        isCode(error, "CAPABILITY_DENIED"),
      );
    }
    expect(host.invocations).toEqual([]);
    expect(Object.keys(REQUIRED_TOKENS).length).toBeGreaterThan(0);
    connection.close();
  });
});

describe("the grant", () => {
  it("reports the tokens the handshake granted", async () => {
    const { connection } = await connectToScriptedHost({
      grantedTokens: ["track.write", "track.read"],
      sessionId: "session-9",
    });

    expect(connection.grant.tokens).toEqual(["track.read", "track.write"]);
    expect(connection.grant.has("track.read")).toBe(true);
    expect(connection.grant.has("tempo.write")).toBe(false);
    expect(connection.grant.provenance.sessionId).toBe("session-9");
    connection.close();
  });

  it("keeps a granted name these bindings cannot name, instead of dropping it", async () => {
    const { connection } = await connectToScriptedHost({
      grantedTokens: ["track.read", "track.system"],
    });

    // `track.system` is first-party: honoured on the wire, absent from the public
    // token union. Dropping it silently is what would make a later denial for a
    // token the host says it granted impossible to explain.
    expect(connection.grant.tokens).toEqual(["track.read"]);
    expect(connection.grant.provenance.unrecognized).toEqual(["track.system"]);
    expect(connection.grant.provenance.granted).toContain("track.system");
    connection.close();
  });

  it("answers what a token list or a profile is short of", async () => {
    const { connection } = await connectToScriptedHost({ grantedTokens: ["track.read"] });

    expect(connection.grant.missing(["track.read"])).toEqual([]);
    expect(connection.grant.missing(["track.read", "tempo.write", "clip.write"])).toEqual([
      "clip.write",
      "tempo.write",
    ]);
    // A profile is a bundle the grant is measured against by name.
    expect(connection.grant.missing("surface.extension-sdk.v1")).toEqual([...PROFILES["surface.extension-sdk.v1"]]);
    connection.close();
  });

  it("refuses a profile name it does not publish", async () => {
    const { connection } = await connectToScriptedHost();

    // Typed as a profile name, so reaching this needs a cast — it is the shape of
    // the failure when the call comes from untyped JavaScript.
    expect(() => connection.grant.missing("surface.made-up.v1" as never)).toThrowError(
      /no published Capability Profile/,
    );
    connection.close();
  });
});

describe("connection.require", () => {
  it("passes when the grant reaches every token", async () => {
    const { connection } = await connectToScriptedHost({ grantedTokens: ["track.read", "track.write"] });
    expect(() => connection.require("track.read", "track.write")).not.toThrow();
    connection.close();
  });

  it("names every missing token, not just the first", async () => {
    const { connection } = await connectToScriptedHost({ grantedTokens: ["track.read"] });

    const error = (() => {
      try {
        connection.require("track.read", "tempo.write", "clip.write");
      } catch (thrown: unknown) {
        return thrown;
      }
      return undefined;
    })();

    if (!isCode(error, "CAPABILITY_DENIED")) {
      throw new Error("expected a CAPABILITY_DENIED");
    }
    expect(error.details.missing).toEqual(["clip.write", "tempo.write"]);
    connection.close();
  });
});

describe("connection.scoped", () => {
  it("is a view, not a client: the object handed back is the same one", async () => {
    const { connection } = await connectToScriptedHost({ grantedTokens: ["track.read"] });

    // "Zero runtime machinery" is the claim (ADR 0094 §5); identity is how it is
    // checked. A scoped client that were a *copy* would be a second surface to
    // keep in step, and could disagree with the guard.
    expect(connection.scoped("surface.cli-mcp.v1")).toBe(connection.client);
    expect(connection.scoped("track.read")).toBe(connection.client);
    connection.close();
  });

  it("types a token set down to what those tokens reach", async () => {
    const { connection } = await connectToScriptedHost({ grantedTokens: ["track.read"] });
    const scoped = connection.scoped("track.read");

    // Reachable with `track.read`: the read methods, and every ungated operation.
    expectTypeOf(scoped.track.list).toBeFunction();
    expectTypeOf(scoped.convert.tickToTime).toBeFunction();
    // Not reachable: a write method under a token the scope does not include.
    // @ts-expect-error `track rename` requires track.write, which this scope lacks
    void scoped.track.rename;
    // Nor a domain no scoped token reaches at all.
    // @ts-expect-error the tempo domain is out of this scope entirely
    void scoped.tempo;
    connection.close();
  });

  it("types a profile down to that profile's reach", async () => {
    const { connection } = await connectToScriptedHost();
    const scoped = connection.scoped("surface.cli-mcp.v1");

    expectTypeOf(scoped.track.rename).toBeFunction();
    expectTypeOf(scoped.tempo.set).toBeFunction();
    connection.close();
  });

  it("still refuses at run time what a wider type would let through", async () => {
    const { connection, host } = await connectToScriptedHost({ grantedTokens: [] });

    // Scoping is a compile-time view of *reach*, not a grant. Typing a client to
    // a profile the session was never granted must not make its calls succeed —
    // the guard reads the grant, never the scope.
    const scoped = connection.scoped("surface.cli-mcp.v1");
    await expect(scoped.track.list()).rejects.toSatisfy((error: unknown) => isCode(error, "CAPABILITY_DENIED"));
    expect(host.invocations).toEqual([]);
    connection.close();
  });
});

describe("the token roster", () => {
  it("is the same set the profiles expand to", () => {
    // The runtime roster exists so a granted name can be told from a typo. It has
    // to agree with the profile table, or `provenance.unrecognized` would report
    // a token the SDK itself publishes.
    const fromProfiles = new Set(Object.values(PROFILES).flat());
    const gating = new Set<CapabilityToken>(Object.values(REQUIRED_TOKENS));
    for (const token of gating) {
      expect(fromProfiles.has(token)).toBe(true);
    }
  });
});
