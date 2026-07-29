/**
 * Emitting `manifest.json` from the TypeScript manifest: what lands in the bundle,
 * and what the emitter refuses before ACE Studio has to.
 */

import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ExtensionError,
  MANIFEST_FILENAME,
  MANIFEST_VERSION,
  SDK_API_VERSION,
  serializeManifest,
  writeManifestJson,
  type ExtensionManifest,
} from "@timedomain/acestudio-extension-sdk";

const MANIFEST = {
  id: "acme.stem-tools",
  name: "Stem Tools",
  version: "1.2.0",
  publisher: "Acme Audio",
  lifecycle: "one-shot",
  capabilities: ["clip.read", "export.invoke"],
  entry: "dist/index.js",
} as const satisfies ExtensionManifest;

/** A manifest with a field the type refuses, as untyped JavaScript reaches the emitter. */
function withField(field: string, value: unknown): ExtensionManifest {
  return { ...MANIFEST, [field]: value } as unknown as ExtensionManifest;
}

function refusal(manifest: ExtensionManifest): string {
  try {
    serializeManifest(manifest);
  } catch (error) {
    expect(error).toBeInstanceOf(ExtensionError);
    return (error as ExtensionError).message;
  }
  throw new Error("the manifest was accepted");
}

describe("serializeManifest", () => {
  it("stamps the bundle-format and SDK versions the author never writes", () => {
    expect(JSON.parse(serializeManifest(MANIFEST))).toEqual({
      manifestVersion: MANIFEST_VERSION,
      sdkApiVersion: SDK_API_VERSION,
      id: "acme.stem-tools",
      name: "Stem Tools",
      version: "1.2.0",
      publisher: "Acme Audio",
      lifecycle: "one-shot",
      capabilities: ["clip.read", "export.invoke"],
      entry: "dist/index.js",
    });
  });

  it("emits the same bytes for the same manifest, whatever order it was written in", () => {
    const reordered: ExtensionManifest = {
      entry: MANIFEST.entry,
      capabilities: MANIFEST.capabilities,
      lifecycle: MANIFEST.lifecycle,
      publisher: MANIFEST.publisher,
      version: MANIFEST.version,
      name: MANIFEST.name,
      id: MANIFEST.id,
    };

    // The signature covers these bytes, so field order cannot be an author's
    // accident.
    expect(serializeManifest(reordered)).toBe(serializeManifest(MANIFEST));
    expect(serializeManifest(MANIFEST).endsWith("}\n")).toBe(true);
  });

  it("carries the optional fields through, host-access block included", () => {
    const full = {
      ...MANIFEST,
      cwd: "dist",
      description: "Render stems from the open project",
      icon: "assets/icon.png",
      hostAccess: {
        filesystem: { read: ["music", "project:Exports", "/Volumes/SampleLib"], write: ["project:Exports"] },
        childProcess: true,
      },
    } as const satisfies ExtensionManifest;

    expect(JSON.parse(serializeManifest(full))).toMatchObject({
      cwd: "dist",
      description: "Render stems from the open project",
      icon: "assets/icon.png",
      hostAccess: {
        filesystem: { read: ["music", "project:Exports", "/Volumes/SampleLib"], write: ["project:Exports"] },
        childProcess: true,
      },
    });
  });

  it("accepts an empty capability request", () => {
    // Ungated operations are reachable by any session, so asking for nothing is a
    // real thing to do. Not declaring `capabilities` at all is not.
    const noCapabilities = { ...MANIFEST, capabilities: [] } as const satisfies ExtensionManifest;
    expect(JSON.parse(serializeManifest(noCapabilities))).toMatchObject({ capabilities: [] });
    expect(refusal(withField("capabilities", undefined))).toContain('"capabilities" must be an array');
  });

  it("refuses the reserved operations key", () => {
    // The v1 host rejects it outright rather than ignoring it, so that an extension
    // declaring operations can never look like it works on a Studio that has no idea
    // what they are. The type refuses one too — this is the untyped path.
    expect(refusal(withField("operations", { "render-stems": {} }))).toContain('"operations" is reserved');
  });

  it("refuses a field it does not know, rather than dropping it", () => {
    expect(refusal(withField("capabilties", ["clip.read"]))).toContain(
      '"capabilties" is not a manifest field this SDK knows',
    );
  });

  it("refuses an id that is not developer-slug.extension-slug", () => {
    for (const id of ["stemtools", "com.acme.stem-tools", "Acme.Stem-Tools", "-acme.stem-tools", "acme."]) {
      expect(refusal(withField("id", id))).toContain('"id" must read developer-slug.extension-slug');
    }
  });

  it("refuses a version that is not semver", () => {
    for (const version of ["1.2", "v1.2.0", "1.02.0", ""]) {
      expect(refusal(withField("version", version))).toContain('"version" must be a semantic version');
    }
  });

  it("refuses an entry that is absent, absolute, or climbing out of the bundle", () => {
    expect(refusal(withField("entry", undefined))).toContain('"entry" is required');
    expect(refusal(withField("entry", "/usr/local/bin/node"))).toContain('"entry" must be bundle-relative');
    expect(refusal(withField("entry", "C:\\Windows\\system32\\cmd.exe"))).toContain('"entry" must be bundle-relative');
    expect(refusal(withField("entry", "../../elsewhere/index.js"))).toContain('"entry" must stay inside the bundle');
  });

  it("refuses an unknown lifecycle", () => {
    expect(refusal(withField("lifecycle", "daemon"))).toContain('"lifecycle" must be "one-shot" or "persistent"');
  });

  it("lists every problem at once", () => {
    // One build, every fix — rather than one refusal per round trip through the
    // signer.
    const message = refusal({ ...MANIFEST, id: "Stem Tools", version: "nope" });
    expect(message).toContain('"id" must read');
    expect(message).toContain('"version" must be');
  });

  describe("the host-access block", () => {
    function hostAccess(value: unknown): string {
      return refusal(withField("hostAccess", value));
    }

    it("refuses a scope that is neither a known name nor a path", () => {
      expect(hostAccess({ filesystem: { read: ["Music"] } })).toContain("is not a known scope: Music");
    });

    it("refuses a project: path that climbs out of the project", () => {
      expect(hostAccess({ filesystem: { read: ["project:../Secrets"] } })).toContain(
        "must name a path inside the project",
      );
      expect(hostAccess({ filesystem: { read: ["project:"] } })).toContain("must name a path inside the project");
    });

    it("refuses writing projectMedia, which is read-only by definition", () => {
      expect(hostAccess({ filesystem: { write: ["projectMedia"] } })).toContain("cannot list projectMedia");
      expect(() =>
        serializeManifest(withField("hostAccess", { filesystem: { read: ["projectMedia"] } })),
      ).not.toThrow();
    });

    it('accepts "all" in place of a list', () => {
      expect(() => serializeManifest(withField("hostAccess", { filesystem: { read: "all" } }))).not.toThrow();
      expect(hostAccess({ filesystem: { read: "everything" } })).toContain(
        '"hostAccess.filesystem.read" must be an array of scopes',
      );
    });

    it("refuses an unknown latch or direction", () => {
      expect(hostAccess({ networkAccess: true })).toContain(
        '"hostAccess.networkAccess" is not a host-access field this SDK knows',
      );
      expect(hostAccess({ filesystem: { execute: ["music"] } })).toContain(
        '"hostAccess.filesystem.execute" is not a direction',
      );
      expect(hostAccess({ childProcess: "yes" })).toContain('"hostAccess.childProcess" must be a boolean');
    });
  });
});

describe("writeManifestJson", () => {
  it("writes manifest.json into the bundle directory and hands back the path", async () => {
    const directory = join(await mkdtemp(join(tmpdir(), "ace-manifest-")), "bundle");

    const path = await writeManifestJson(MANIFEST, directory);

    expect(path).toBe(join(directory, MANIFEST_FILENAME));
    expect(await readFile(path, "utf8")).toBe(serializeManifest(MANIFEST));
  });

  it("writes nothing when the manifest would not install", async () => {
    const directory = join(await mkdtemp(join(tmpdir(), "ace-manifest-")), "bundle");

    await expect(writeManifestJson(withField("id", "nope"), directory)).rejects.toBeInstanceOf(ExtensionError);
    await expect(readFile(join(directory, MANIFEST_FILENAME), "utf8")).rejects.toThrow();
  });
});
