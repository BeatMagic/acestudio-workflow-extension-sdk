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
  NOTIFICATION_CHANNELS,
  OPERATIONS,
  PROFILES,
  REQUIRED_TOKENS,
  type BridgeConnection,
  type CapabilityToken,
  type ChangeEvent,
  type InvokeParams,
  type OperationWarning,
  type TrackListResult,
} from "@timedomain/acestudio-bridge-core";
// Reached by path, not through the package entry: these are @internal helpers,
// and the pre-wire guard has a half the generated table cannot exercise yet.
import { domainKey, guardCall } from "../src/bindings.js";
import { HOST_INVOKE, ScriptedHostPeer, type ScriptedHostOptions } from "./support/host-peer.js";

async function connectToScriptedHost(
  options: ScriptedHostOptions = {},
): Promise<{ connection: BridgeConnection; host: ScriptedHostPeer }> {
  const { client, host: hostTransport } = createTransportPair();
  const host = new ScriptedHostPeer(hostTransport, options);
  const connection = await connect({ transport: client, authToken: "token-abc" });
  return { connection, host };
}

/**
 * Let the transport pair deliver. Both ends hand messages over through
 * `queueMicrotask`, and a notification has no response to await, so a test that
 * pushes one has to yield before asserting on what arrived.
 */
async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
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
    // runtime nests by domain and camelCases a hyphenated name the same way the
    // generated interface spells it. No domain is hyphenated today, so the
    // camelCase half rides on a command name (`ui show-special-track`).
    expect(typeof connection.client.track.list).toBe("function");
    expect(typeof connection.client.ui.showSpecialTrack).toBe("function");
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
      grantedTokens: ["transport.control"],
      operations: { "transport set-loop": { data: {} } },
    });

    // `transport set-loop` is one of the writes that actually check a
    // fingerprint, so it is one of the few whose options carry `ifMatch` at all.
    await connection.client.transport.setLoop(
      { startTick: 0, endTick: 3_840 },
      // `ifMatch` is opaque, obtainable only from a read result — the cast is
      // this test standing in for that read.
      { waitBusy: 2_500, ifMatch: "fp-1" as never },
    );

    // The busy wait rides the envelope; the fingerprint rides inside `arguments`
    // under the reserved key (ADR 0088 §5). Getting these two the wrong way round
    // is exactly the mistake a scripted caller cannot see.
    expect(host.invocations[0]).toEqual({
      path: "transport set-loop",
      arguments: { startTick: 0, endTick: 3_840, fingerprint: "fp-1" },
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

});

describe("an operation's advisory warnings", () => {
  const TRUNCATED = { code: "NAME_TRUNCATED", hint: "the name was too long" };

  async function connectWithAWarningToRaise() {
    return connectToScriptedHost({
      grantedTokens: ["track.write"],
      operations: { "track rename": { data: {}, warnings: [TRUNCATED] } },
    });
  }

  it("reaches a listener, tagged with the call that raised it", async () => {
    const { connection } = await connectWithAWarningToRaise();
    const seen: OperationWarning[] = [];
    connection.onWarning((warning) => seen.push(warning));

    await connection.client.track.rename({ trackIndex: 0, newName: "x".repeat(500) });

    // The path is what makes a warning actionable: a listener sees warnings from
    // every call on the connection, and the code alone would not say which.
    expect(seen).toEqual([{ ...TRUNCATED, path: "track rename" }]);
    connection.close();
  });

  it("goes to the log when nobody is listening, rather than being dropped", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { connection } = await connectWithAWarningToRaise();

    await connection.client.track.rename({ trackIndex: 0, newName: "x".repeat(500) });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("NAME_TRUNCATED"));
    warn.mockRestore();
    connection.close();
  });

  it("stops logging once a listener takes over, and resumes when it leaves", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { connection } = await connectWithAWarningToRaise();
    const stop = connection.onWarning(() => {});

    await connection.client.track.rename({ trackIndex: 0, newName: "a" });
    expect(warn).not.toHaveBeenCalled();

    // Unsubscribing puts the fallback back, rather than leaving the connection
    // silently discarding advisories for the rest of the session.
    stop();
    await connection.client.track.rename({ trackIndex: 0, newName: "b" });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("NAME_TRUNCATED"));

    warn.mockRestore();
    connection.close();
  });

  it("does not let a throwing listener fail the call it was reporting on", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { connection } = await connectWithAWarningToRaise();
    connection.onWarning(() => {
      throw new Error("listener bug");
    });

    // The operation already succeeded. Turning an advisory into a rejection would
    // report a failure that did not happen.
    await expect(connection.client.track.rename({ trackIndex: 0, newName: "a" })).resolves.toBeDefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("listener bug"));

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
        domainKey(operation.domain)
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

describe("the pre-wire guard's field half", () => {
  // ADR 0071 tier 2: a capability-gated *argument* is refused before the wire the
  // same way an operation is. The generated `FIELD_CAPABILITIES` has no rows yet,
  // so the guard is driven directly against a table that does — an unexercised
  // gate is one nobody would notice failing the day rows appear.
  const table = { "track rename": { systemSlot: "track.system" as CapabilityToken } };
  const operation = { path: "track rename", ungated: false };

  async function grantOf(tokens: readonly string[]) {
    const { connection } = await connectToScriptedHost({ grantedTokens: tokens });
    return connection.grant;
  }

  it("passes a call that leaves the gated field unset", async () => {
    const grant = await grantOf(["track.write"]);
    expect(guardCall(grant, operation, { trackIndex: 0 }, table)).toBeUndefined();
  });

  it("refuses a call that sets a gated field the grant cannot reach", async () => {
    const grant = await grantOf(["track.write"]);
    const denial = guardCall(grant, operation, { trackIndex: 0, systemSlot: "lead" }, table);
    expect(isCode(denial, "CAPABILITY_DENIED")).toBe(true);
    // The field is named, not just the operation: "track rename is denied" would
    // send an author looking for the wrong missing capability.
    expect(denial?.message).toContain("--systemSlot");
    expect(denial?.details.missing).toEqual(["track.system"]);
  });

  it("passes the same call once the field's token is granted", async () => {
    const grant = await grantOf(["track.write", "track.system"]);
    expect(guardCall(grant, operation, { trackIndex: 0, systemSlot: "lead" }, table)).toBeUndefined();
  });

  it("refuses a gated operation with no row in the token table", async () => {
    const grant = await grantOf(["track.write"]);
    // Fails closed, as the host does for a command whose capability it cannot look
    // up: an unreadable table is not a reason to try the call.
    const denial = guardCall(grant, { path: "track invented", ungated: false }, {});
    expect(isCode(denial, "CAPABILITY_DENIED")).toBe(true);
    expect(denial?.details.missing).toEqual([]);
  });
});

describe("the change subscriptions", () => {
  it("delivers a granted channel's changes to its domain's listener", async () => {
    const { connection, host } = await connectToScriptedHost({ grantedTokens: ["job.read"] });
    const seen: ChangeEvent[] = [];

    const stop = connection.client.job.onChanged((event) => seen.push(event));
    expect(host.notifyChange("jobs", ["job-7"])).toBe(true);
    await flush();

    expect(seen).toEqual([{ channel: "jobs", revision: 1, changes: ["job-7"] }]);

    // Unsubscribing is what it claims: the next change reaches nobody, even
    // though the host still sent it.
    stop();
    expect(host.notifyChange("jobs", ["job-8"])).toBe(true);
    await flush();
    expect(seen).toHaveLength(1);
    connection.close();
  });

  it("refuses an ungranted subscription rather than never calling back", async () => {
    const { connection, host } = await connectToScriptedHost({ grantedTokens: ["job.control"] });

    // The failure this guard exists to prevent: without it, subscribing succeeds,
    // the host withholds the channel, and the extension waits forever on a
    // callback — indistinguishable from a subject that has not changed.
    expect(host.notifyChange("jobs")).toBe(false);
    expect(() => connection.client.job.onChanged(() => {})).toThrowError(
      expect.objectContaining({ code: "CAPABILITY_DENIED" }),
    );

    const error = (() => {
      try {
        connection.client.job.onChanged(() => {});
        return undefined;
      } catch (thrown: unknown) {
        return thrown;
      }
    })();
    if (!isCode(error, "CAPABILITY_DENIED")) {
      throw new Error("expected a CAPABILITY_DENIED");
    }
    // The same code and the same details a refused *call* carries, so one branch
    // handles both. Only the message differs, because the host composes none for
    // a subscription it simply withholds.
    expect(error.details.missing).toEqual(["job.read"]);
    expect(error.details.token).toBe("job.read");
    expect(error.hint).toBe("missing capability token: job.read");
    expect(error.message).toContain("jobs");
    connection.close();
  });

  it("binds and guards every declared channel from the generated table", async () => {
    const { connection } = await connectToScriptedHost({ grantedTokens: [] });
    expect(NOTIFICATION_CHANNELS.length).toBeGreaterThan(0);

    // Table-driven for the same reason the operation guard is: a channel added to
    // the registry must arrive already gated, not gated once someone remembers.
    for (const descriptor of NOTIFICATION_CHANNELS) {
      const domain = (connection.client as unknown as Record<string, Record<string, (cb: () => void) => void>>)[
        domainKey(descriptor.domain)
      ];
      expect(typeof domain[descriptor.method]).toBe("function");
      expect(() => domain[descriptor.method](() => {})).toThrowError(
        expect.objectContaining({ code: "CAPABILITY_DENIED" }),
      );
    }
    connection.close();
  });

  it("demultiplexes by channel, so one subject's listener never sees another's", async () => {
    const { connection, host } = await connectToScriptedHost({ grantedTokens: ["job.read"] });
    const seen: string[] = [];
    connection.client.job.onChanged((event) => seen.push(event.channel));

    // A channel this artifact cannot name, arriving on the same wire notification.
    // Nothing listens for it, so it is dropped rather than fanned out to whoever
    // happens to be subscribed.
    host.notifyUnknownChannel("project");
    expect(host.notifyChange("jobs")).toBe(true);
    await flush();

    expect(seen).toEqual(["jobs"]);
    connection.close();
  });
});

describe("a host fault becoming a BridgeError", () => {
  it("keeps the canonical code's details to itself", async () => {
    const { connection } = await connectToScriptedHost({
      grantedTokens: ["track.write"],
      operations: {
        "track rename": {
          fault: { code: -32050, message: "the user is editing", data: { code: "USER_BUSY", hint: "retry" } },
        },
      },
    });

    const error = await connection.client.track.rename({ trackIndex: 0, newName: "x" }).catch((e: unknown) => e);

    if (!isBridgeError(error)) {
      throw new Error("expected a BridgeError");
    }
    expect(error.code).toBe("USER_BUSY");
    expect(error.hint).toBe("retry");
    // A code that declares a details shape gets that shape and nothing else — the
    // numeric envelope code is not contract and does not belong inside it.
    expect(error.details).toEqual({});
    connection.close();
  });

  it("keeps the numeric code when the host named none", async () => {
    const { connection } = await connectToScriptedHost({
      grantedTokens: ["track.write"],
      operations: { "track rename": { fault: { code: -32603, message: "handler blew up" } } },
    });

    const error = await connection.client.track.rename({ trackIndex: 0, newName: "x" }).catch((e: unknown) => e);

    if (!isBridgeError(error)) {
      throw new Error("expected a BridgeError");
    }
    // Nothing canonical to report, so the envelope's own code is the only
    // diagnostic there is — worth keeping precisely here.
    expect(error.code).toBe("HANDLER_FAILED");
    expect(error.details).toEqual({ jsonRpcCode: -32603 });
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
