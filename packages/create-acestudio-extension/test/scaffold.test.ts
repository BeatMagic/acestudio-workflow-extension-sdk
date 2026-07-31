import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vitest";
import {
  defaultsFor,
  scaffold,
  ScaffoldError,
  toSlug,
  type ScaffoldOptions,
} from "@timedomain/create-acestudio-extension";

/** A fresh empty directory to scaffold into, cleaned up with the temp root. */
function target(name = "my-extension"): string {
  return join(mkdtempSync(join(tmpdir(), "create-ace-ext-")), name);
}

function options(directory: string, overrides: Partial<ScaffoldOptions> = {}): ScaffoldOptions {
  return {
    directory,
    id: "acme.stem-tools",
    name: "Stem Tools",
    publisher: "Acme Audio",
    ...overrides,
  };
}

const read = (directory: string, file: string): string => readFileSync(join(directory, file), "utf8");

test("emits the whole working extension, sorted and archive-relative", async () => {
  const directory = target();

  const result = await scaffold(options(directory));

  expect(result.directory).toBe(directory);
  expect(result.files).toEqual([
    ".gitignore",
    "AGENTS.md",
    "LICENSE",
    "README.md",
    "build.mjs",
    "package.json",
    "src/index.ts",
    "src/manifest.ts",
    "src/protocol.ts",
    "tsconfig.json",
    "ui/index.html",
    "ui/main.ts",
  ]);
});

test("the dotfile npm would have stripped from the tarball lands as a dotfile", async () => {
  const directory = target();

  await scaffold(options(directory));

  expect(read(directory, ".gitignore")).toContain("node_modules");
});

test("writes the identity the author gave into the manifest, and names the package after the directory", async () => {
  const directory = target("stem-tools");

  await scaffold(options(directory, { description: "Split stems, quickly." }));

  const manifest = read(directory, "src/manifest.ts");
  expect(manifest).toContain('id: "acme.stem-tools"');
  expect(manifest).toContain('name: "Stem Tools"');
  expect(manifest).toContain('publisher: "Acme Audio"');
  expect(manifest).toContain('description: "Split stems, quickly."');

  const pkg = JSON.parse(read(directory, "package.json")) as { name: string; description: string };
  expect(pkg.name).toBe("stem-tools");
  expect(pkg.description).toBe("Split stems, quickly.");
});

test("leaves no placeholder unsubstituted anywhere in the emitted tree", async () => {
  const directory = target();

  const result = await scaffold(options(directory));

  for (const file of result.files) {
    expect(read(directory, file), file).not.toMatch(/\{\{\w+\}\}/);
  }
});

test("depends on the SDK line this scaffolder was released alongside", async () => {
  const directory = target();

  await scaffold(options(directory, { sdkVersionRange: "^1.2.3" }));

  const pkg = JSON.parse(read(directory, "package.json")) as { dependencies: Record<string, string> };
  expect(pkg.dependencies["@timedomain/acestudio-extension-sdk"]).toBe("^1.2.3");
});

test("defaults the SDK range to this package's own version", async () => {
  const directory = target();

  await scaffold(options(directory));

  const pkg = JSON.parse(read(directory, "package.json")) as { dependencies: Record<string, string> };
  expect(pkg.dependencies["@timedomain/acestudio-extension-sdk"]).toMatch(/^\^\d+\.\d+\.\d+/);
});

test("scaffolds into a directory that exists but is empty", async () => {
  const directory = target();
  await mkdir(directory, { recursive: true });

  await expect(scaffold(options(directory))).resolves.toMatchObject({ directory });
});

test("refuses a directory with anything already in it", async () => {
  const directory = target();
  await mkdir(directory, { recursive: true });
  writeFileSync(join(directory, "README.md"), "mine\n");

  await expect(scaffold(options(directory))).rejects.toThrow(ScaffoldError);
  // The author's file is still theirs.
  expect(read(directory, "README.md")).toBe("mine\n");
});

test.each([
  ["com.acme.stem-tools", "a reverse-domain id"],
  ["Acme.stem-tools", "an upper-case slug"],
  ["stem-tools", "no developer slug"],
  ["acme.", "an empty extension slug"],
])("refuses %s (%s)", async (id) => {
  await expect(scaffold(options(target(), { id }))).rejects.toThrow(ScaffoldError);
});

test.each([
  ["name", { name: "" }],
  ["publisher", { publisher: "  " }],
])("refuses an empty %s", async (_field, overrides) => {
  await expect(scaffold(options(target(), overrides))).rejects.toThrow(ScaffoldError);
});

test("derives every field from the directory name", () => {
  expect(defaultsFor("/tmp/whatever/Stem Tools")).toEqual({
    id: "example-developer.stem-tools",
    name: "Stem Tools",
    packageName: "stem-tools",
    publisher: "Example Developer",
  });
});

test("derives the developer slug from a publisher when there is one", () => {
  expect(defaultsFor("/tmp/whatever/stem-tools", "Acme Audio!").id).toBe("acme-audio.stem-tools");
});

test.each([
  ["Stem Tools", "stem-tools"],
  ["  --Acme_Audio--  ", "acme-audio"],
  ["v2 Splitter", "v2-splitter"],
  ["...", ""],
])("slugs %s to %s", (text, slug) => {
  expect(toSlug(text)).toBe(slug);
});
