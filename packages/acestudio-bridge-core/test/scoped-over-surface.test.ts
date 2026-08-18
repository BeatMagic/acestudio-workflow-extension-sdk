/**
 * Scoping a surface this package does not publish.
 *
 * The narrowing types used to read this artifact's own table, which was enough
 * while a session's whole reach was published here. It is not: a profile's tokens
 * can gate operations declared by a first-party artifact too, and a facade able to
 * see only half of them reports the other half as ungranted. So the table and the
 * bindings are parameters now, and what needs proving is that they are honoured —
 * a fixture artifact, unrelated to the generated one, scoped by its own tokens.
 *
 * Channels are rows like any other. The case that decides whether the filter reads
 * a row or a domain is a channel whose token reaches none of its domain's
 * operations: scoping to it must yield the subscription and nothing else.
 *
 * The assertions are all type-level; the runtime one exists so a failure is a
 * failing test rather than a silent absence.
 */

import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  ArtifactRow,
  ChannelDescriptor,
  OperationDescriptor,
  PublicBindings,
  ScopedBindings,
  ScopedBindingsOf,
} from "@timedomain/acestudio-bridge-core";

/**
 * A second artifact's table, shaped like a generated one: two gated domains, a
 * hyphenated domain that has to camelCase, and an ungated row every session
 * reaches.
 */
const FOREIGN_OPERATIONS = [
  {
    path: "media probe",
    domain: "media",
    method: "probe",
    capability: "media.probe",
    ungated: false,
    mutating: false,
    fingerprintPrecondition: false,
    takesParams: true,
  },
  {
    path: "media cut-audio",
    domain: "media",
    method: "cutAudio",
    capability: "media.cutAudio",
    ungated: false,
    mutating: true,
    fingerprintPrecondition: false,
    takesParams: true,
  },
  {
    path: "canvas set",
    domain: "canvas",
    method: "set",
    capability: "canvas.write",
    ungated: false,
    mutating: true,
    fingerprintPrecondition: false,
    takesParams: true,
  },
  {
    path: "special-tracks list",
    domain: "special-tracks",
    method: "list",
    capability: "track.read",
    ungated: false,
    mutating: false,
    fingerprintPrecondition: false,
    takesParams: false,
  },
  {
    path: "time now",
    domain: "time",
    method: "now",
    capability: "time.now",
    ungated: true,
    mutating: false,
    fingerprintPrecondition: false,
    takesParams: false,
  },
] as const satisfies readonly OperationDescriptor[];

/**
 * The same artifact's channels. `canvas.changed` is gated by `canvas.read`, which
 * reaches no `canvas` operation — the fixture's whole point.
 */
const FOREIGN_CHANNELS = [
  {
    notification: "media.changed",
    domain: "media",
    method: "onChanged",
    capability: "media.probe",
  },
  {
    notification: "canvas.changed",
    domain: "canvas",
    method: "onChanged",
    capability: "canvas.read",
  },
] as const satisfies readonly ChannelDescriptor[];

type ForeignRows = (typeof FOREIGN_OPERATIONS)[number] | (typeof FOREIGN_CHANNELS)[number];

interface ForeignBindings {
  readonly media: {
    probe(params: { src: string }): Promise<{ dur: number }>;
    cutAudio(params: { src: string }): Promise<void>;
    onChanged(listener: () => void): () => void;
  };
  readonly canvas: {
    set(params: { width: number }): Promise<void>;
    onChanged(listener: () => void): () => void;
  };
  readonly specialTracks: {
    list(): Promise<readonly string[]>;
  };
  readonly time: {
    now(): Promise<number>;
  };
}

type ScopedForeign<T extends string> = ScopedBindingsOf<ForeignRows, ForeignBindings, T>;

describe("scoping a foreign surface", () => {
  it("keeps only the methods the tokens reach, domain by domain", () => {
    type MediaProbeOnly = ScopedForeign<"media.probe">;

    expectTypeOf<MediaProbeOnly>().toHaveProperty("media");
    expectTypeOf<MediaProbeOnly["media"]>().toHaveProperty("probe");
    // The sibling method sits in a reached domain but behind a token this scope
    // does not hold, which is the case a domain-level filter would get wrong.
    expectTypeOf<MediaProbeOnly["media"]>().not.toHaveProperty("cutAudio");

    expect(FOREIGN_OPERATIONS.length).toBe(5);
    expect(FOREIGN_CHANNELS.length).toBe(2);
  });

  it("drops a domain no token reaches", () => {
    expectTypeOf<ScopedForeign<"media.probe">>().not.toHaveProperty("canvas");
  });

  it("admits an ungated operation to every scope, including an empty one", () => {
    expectTypeOf<ScopedForeign<"media.probe">>().toHaveProperty("time");
    // `never` is the scope of a session granted nothing at all.
    expectTypeOf<ScopedForeign<never>>().toHaveProperty("time");
    expectTypeOf<ScopedForeign<never>>().not.toHaveProperty("media");
  });

  it("camelCases a hyphenated domain into its binding key", () => {
    type Tracks = ScopedForeign<"track.read">;

    expectTypeOf<Tracks>().toHaveProperty("specialTracks");
    expectTypeOf<Tracks["specialTracks"]>().toHaveProperty("list");
  });

  it("carries several domains when the tokens span them", () => {
    type Both = ScopedForeign<"media.cutAudio" | "canvas.write">;

    expectTypeOf<Both>().toHaveProperty("media");
    expectTypeOf<Both>().toHaveProperty("canvas");
    expectTypeOf<Both["media"]>().toHaveProperty("cutAudio");
    expectTypeOf<Both["media"]>().not.toHaveProperty("probe");
  });

  it("admits the subscription a token reaches beside the calls it reaches", () => {
    type MediaProbe = ScopedForeign<"media.probe">;

    // `media.probe` gates both the call and the channel, so the scope holds both.
    expectTypeOf<MediaProbe["media"]>().toHaveProperty("probe");
    expectTypeOf<MediaProbe["media"]>().toHaveProperty("onChanged");
  });

  it("reaches a domain by its channel alone", () => {
    // `canvas.read` gates no canvas operation. A per-domain filter would either drop
    // the domain (losing a granted subscription) or admit `set` with it (handing over
    // a write the scope was never granted).
    type CanvasRead = ScopedForeign<"canvas.read">;

    expectTypeOf<CanvasRead>().toHaveProperty("canvas");
    expectTypeOf<CanvasRead["canvas"]>().toHaveProperty("onChanged");
    expectTypeOf<CanvasRead["canvas"]>().not.toHaveProperty("set");
  });

  it("withholds the subscription from a scope that only reaches the calls", () => {
    type CanvasWrite = ScopedForeign<"canvas.write">;

    expectTypeOf<CanvasWrite["canvas"]>().toHaveProperty("set");
    expectTypeOf<CanvasWrite["canvas"]>().not.toHaveProperty("onChanged");
  });
});

describe("this artifact's own scoping", () => {
  it("is the general form applied to the generated tables", () => {
    // The published `ScopedBindings` is now an alias. Pinning the equivalence is
    // what keeps a change to the general form from quietly re-shaping the client
    // every consumer of this package already depends on. `ArtifactRow`, not
    // `Descriptor`: the published scope covers this artifact's channels too.
    expectTypeOf<ScopedBindings<"track.read">>().toEqualTypeOf<
      ScopedBindingsOf<ArtifactRow, PublicBindings, "track.read">
    >();

    expect(true).toBe(true);
  });

  it("splits transport by token, where the channel and the calls differ", () => {
    // The generated table's own instance of the fixture's sharp case: `transport
    // play` needs `transport.control`, while `transport.changed` needs
    // `transport.state`. Neither token should hand over the other's member.
    expectTypeOf<ScopedBindings<"transport.control">["transport"]>().toHaveProperty("play");
    expectTypeOf<ScopedBindings<"transport.control">["transport"]>().not.toHaveProperty(
      "onChanged",
    );

    expectTypeOf<ScopedBindings<"transport.state">["transport"]>().toHaveProperty("onChanged");
    expectTypeOf<ScopedBindings<"transport.state">["transport"]>().not.toHaveProperty("play");
  });
});
