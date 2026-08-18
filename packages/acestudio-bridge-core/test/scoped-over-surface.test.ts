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
 * The assertions are all type-level; the runtime one exists so a failure is a
 * failing test rather than a silent absence.
 */

import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  Descriptor,
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

type ForeignRows = (typeof FOREIGN_OPERATIONS)[number];

interface ForeignBindings {
  readonly media: {
    probe(params: { src: string }): Promise<{ dur: number }>;
    cutAudio(params: { src: string }): Promise<void>;
  };
  readonly canvas: {
    set(params: { width: number }): Promise<void>;
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
});

describe("this artifact's own scoping", () => {
  it("is the general form applied to the generated table", () => {
    // The published `ScopedBindings` is now an alias. Pinning the equivalence is
    // what keeps a change to the general form from quietly re-shaping the client
    // every consumer of this package already depends on.
    expectTypeOf<ScopedBindings<"track.read">>().toEqualTypeOf<
      ScopedBindingsOf<Descriptor, PublicBindings, "track.read">
    >();

    expect(true).toBe(true);
  });
});
