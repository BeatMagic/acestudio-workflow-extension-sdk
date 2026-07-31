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
  CapabilityTokensOf,
  ExtensionContext,
  ExtensionDefinition,
  ExtensionManifest,
  ManifestClient,
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

/** A manifest asking by profile name rather than token by token. */
const BY_PROFILE = {
  ...READS_CLIPS,
  capabilities: ["surface.extension-sdk.v1"],
} as const satisfies ExtensionManifest;

/**
 * Every call the manifests above do and do not admit, as call sites the compiler
 * checks. Never invoked: the contexts are parameters, and there is nothing behind
 * them.
 */
function callsTheManifestDecides(
  readsClips: ExtensionContext<typeof READS_CLIPS>,
  asksNothing: ExtensionContext<typeof ASKS_NOTHING>,
  byProfile: ExtensionContext<typeof BY_PROFILE>,
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

  // A profile stands for its bundle of tokens, so the surface it admits is the
  // union's, not the profile name's.
  void byProfile.grant.tokens;
  // @ts-expect-error -- the extension-SDK surface profile carries no clip capability
  void byProfile.client.clip;
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

  it("expands a profile name to the tokens it stands for", () => {
    expectTypeOf<CapabilityTokensOf<"surface.extension-sdk.v1">>().toEqualTypeOf<
      "session.handshake" | "session.ping" | "session.shutdown" | "workflow.dev" | "workflow.ui"
    >();
    expectTypeOf<CapabilityTokensOf<"clip.read">>().toEqualTypeOf<"clip.read">();
  });

  it("reaches the whole public surface when the manifest is not literal", () => {
    // Nothing left to narrow by: a manifest typed as the interface rather than
    // written `as const` says only that its capabilities are capabilities.
    expectTypeOf<ManifestClient<ExtensionManifest>>().toHaveProperty("track");
    expectTypeOf<keyof ManifestClient<ExtensionManifest>>().toEqualTypeOf<keyof PublicBindings>();
  });

  it("is a compile-time view — there is nothing here to run", () => {
    expect(typeof callsTheManifestDecides).toBe("function");
    expect(typeof reservedNames).toBe("function");
    expect(typeof absolutePathForms).toBe("function");
  });
});
