/**
 * What writing the manifest in TypeScript buys: a client narrowed to exactly the
 * capability request, and the reserved key refused before it can ship.
 *
 * Most of this file is checked by `tsc`, not by vitest. The guarantee is that the
 * wrong call *does not compile*, so the assertions are `@ts-expect-error` lines
 * inside functions nothing calls — the typecheck reads them, the test run never
 * executes them, and an `@ts-expect-error` that stops being an error fails `npm run
 * typecheck`. The vitest blocks below name the type relations worth reading as
 * prose.
 */

import { describe, expect, expectTypeOf, it } from "vitest";
import type { PublicBindings } from "@timedomain/acestudio-bridge-core";
import type {
  AbsoluteFilesystemPath,
  ExtensionContext,
  ExtensionDefinition,
  ExtensionManifest,
  ManifestClient,
  RequestedCapability,
} from "@timedomain/acestudio-workflow-extension-sdk";

/** A manifest asking to read clips, and nothing else. */
const READS_CLIPS = {
  id: "acme.stem-tools",
  name: "Stem Tools",
  version: "1.2.0",
  publisher: "Acme Audio",
  lifecycle: "one-shot",
  capabilities: ["clip.read"],
  entry: "dist/index.js",
} as const satisfies ExtensionManifest;

/** A manifest asking for nothing at all — which is a legitimate thing to ask for. */
const ASKS_NOTHING = { ...READS_CLIPS, capabilities: [] } as const satisfies ExtensionManifest;

/** A manifest asking for two tokens, so its client is the union's surface. */
const READS_AND_WRITES_CLIPS = {
  ...READS_CLIPS,
  capabilities: ["clip.read", "clip.write"],
} as const satisfies ExtensionManifest;

/**
 * Every call the manifests above do and do not admit, as call sites the compiler
 * checks. Never invoked: the contexts are parameters, and there is nothing behind
 * them.
 */
function callsTheManifestDecides(
  readsClips: ExtensionContext<typeof READS_CLIPS>,
  asksNothing: ExtensionContext<typeof ASKS_NOTHING>,
  readsAndWrites: ExtensionContext<typeof READS_AND_WRITES_CLIPS>,
): void {
  // What the manifest asked for, reachable by name.
  void readsClips.client.clip.list({ trackIndex: 0 });
  void readsClips.client.clip.get;

  // @ts-expect-error -- the manifest does not ask for track.read, so there is no track domain
  void readsClips.client.track;
  // @ts-expect-error -- clip.write is not asked for, so the clip domain keeps only its reads
  void readsClips.client.clip.create;

  // An ungated operation — a registry-declared pure function — is reachable by any
  // session, including one that asked for nothing.
  void asksNothing.client.convert.tickToTime;
  // @ts-expect-error -- and nothing that is gated is
  void asksNothing.client.clip;

  // The surface a list admits is the union of its tokens, not one of them: asking
  // for both halves of `clip` reaches the reads *and* the writes.
  void readsAndWrites.client.clip.list;
  void readsAndWrites.client.clip.create;
  // @ts-expect-error -- still only what was asked for; no token here reaches track
  void readsAndWrites.client.track;
}

/**
 * A Surface Profile is a ceiling, not a request. Studio refuses a manifest naming
 * one at parse — by `surface.` prefix, so it holds for a ceiling this build has
 * never heard of — and the type refuses it here, while the author still has a
 * compiler in front of them.
 */
function unrequestableNames(): void {
  const namesACeiling = {
    ...READS_CLIPS,
    // @ts-expect-error -- a `surface.*` name is the ceiling Studio grants this consumer
    // class within, not a capability to request; the host refuses the bundle outright
    capabilities: ["surface.extension-sdk"],
  } as const satisfies ExtensionManifest;
  void namesACeiling;
}

/** The reserved names, as the declarations that must not compile. */
function reservedNames(): void {
  const definition: ExtensionDefinition<typeof READS_CLIPS> = {
    manifest: READS_CLIPS,
    activate: () => undefined,
    // @ts-expect-error -- `operations` is reserved for a later ACE Studio and omitted from the v1 type
    operations: { "render-stems": {} },
  };
  void definition;

  const manifest = {
    id: "acme.stem-tools",
    name: "Stem Tools",
    version: "1.2.0",
    publisher: "Acme Audio",
    lifecycle: "one-shot",
    capabilities: ["clip.read"],
    entry: "dist/index.js",
    // @ts-expect-error -- the manifest key is reserved too; the v1 host refuses a bundle carrying it
    operations: { "render-stems": {} },
  } as const satisfies ExtensionManifest;
  void manifest;

  const misspelled = {
    id: "acme.stem-tools",
    name: "Stem Tools",
    version: "1.2.0",
    publisher: "Acme Audio",
    lifecycle: "one-shot",
    // @ts-expect-error -- a typed manifest is what catches this one at build time
    capabilties: ["clip.read"],
    entry: "dist/index.js",
  } as const satisfies ExtensionManifest;
  void misspelled;
}

/**
 * The absolute-path scope forms, as declarations the compiler admits or refuses.
 * The type has to agree with what {@link serializeManifest} accepts, or it promises
 * an author a path the emitter then refuses.
 */
function absolutePathForms(): void {
  const accepted: AbsoluteFilesystemPath[] = ["/Users/sam/Stems", "\\\\studio-nas\\stems", "D:/Stems", "D:\\Stems"];
  void accepted;

  // @ts-expect-error -- one leading backslash is drive-relative on Windows, so it
  // names a different folder depending on the process's current drive
  const driveRelative: AbsoluteFilesystemPath = "\\Stems";
  void driveRelative;

  // @ts-expect-error -- and a plain relative path is not a scope at all
  const relative: AbsoluteFilesystemPath = "Stems/Renders";
  void relative;

  // @ts-expect-error -- a drive is one letter, so this is a scheme or a folder name
  const notADrive: AbsoluteFilesystemPath = "Disk:/Stems";
  void notADrive;

  // @ts-expect-error -- a bare drive prefix is relative to that drive's current folder
  const driveRelativeToo: AbsoluteFilesystemPath = "D:Stems";
  void driveRelativeToo;
}

describe("the manifest-scoped client", () => {
  it("keeps the domains the capability request reaches, and drops the rest", () => {
    expectTypeOf<ManifestClient<typeof READS_CLIPS>>().toHaveProperty("clip");
    expectTypeOf<ManifestClient<typeof READS_CLIPS>>().not.toHaveProperty("track");
    // Ungated operations are nobody's capability, so they are always there.
    expectTypeOf<ManifestClient<typeof READS_CLIPS>>().toHaveProperty("convert");
    expectTypeOf<ManifestClient<typeof ASKS_NOTHING>>().toHaveProperty("convert");
    expectTypeOf<ManifestClient<typeof ASKS_NOTHING>>().not.toHaveProperty("clip");
  });

  it("keeps only the methods those capabilities can call inside a domain", () => {
    expectTypeOf<ManifestClient<typeof READS_CLIPS>["clip"]>().toHaveProperty("list");
    expectTypeOf<ManifestClient<typeof READS_CLIPS>["clip"]>().not.toHaveProperty("create");
  });

  it("scopes by the manifest's tokens, with no expansion step in between", () => {
    expectTypeOf<ManifestClient<typeof READS_AND_WRITES_CLIPS>["clip"]>().toHaveProperty("list");
    expectTypeOf<ManifestClient<typeof READS_AND_WRITES_CLIPS>["clip"]>().toHaveProperty("create");
    expectTypeOf<ManifestClient<typeof READS_AND_WRITES_CLIPS>>().not.toHaveProperty("track");
  });

  it("admits a token as a request, and a Surface Profile ceiling not at all", () => {
    expectTypeOf<"clip.read">().toExtend<RequestedCapability>();
    // The name resolves — `PROFILES` publishes it — but it is the ceiling a grant
    // is measured against, so it is not in the request namespace at all.
    expectTypeOf<"surface.extension-sdk">().not.toExtend<RequestedCapability>();
  });

  it("reaches the whole public surface when the manifest is not literal", () => {
    // Nothing left to narrow by: a manifest typed as the interface rather than
    // written `as const` says only that its capabilities are capabilities.
    expectTypeOf<ManifestClient<ExtensionManifest>>().toHaveProperty("track");
    expectTypeOf<keyof ManifestClient<ExtensionManifest>>().toEqualTypeOf<keyof PublicBindings>();
  });

  it("is a compile-time view — there is nothing here to run", () => {
    expect(typeof callsTheManifestDecides).toBe("function");
    expect(typeof unrequestableNames).toBe("function");
    expect(typeof reservedNames).toBe("function");
    expect(typeof absolutePathForms).toBe("function");
  });
});
