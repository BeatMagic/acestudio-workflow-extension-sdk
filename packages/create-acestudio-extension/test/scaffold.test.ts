import { lstatSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, test } from "vitest";
import {
  defaultsFor,
  scaffold,
  ScaffoldError,
  SDK_VERSION_RANGE,
  toSlug,
  type ScaffoldOptions,
} from "@timedomain/create-acestudio-extension";

/** One root for the file's temp directories, so nothing is left in $TMPDIR after a run. */
const root = mkdtempSync(join(tmpdir(), "create-ace-ext-"));
let taken = 0;

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

/** A fresh empty directory to scaffold into. */
function target(name = "my-extension"): string {
  return join(root, `t${String(taken++)}`, name);
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
    "CLAUDE.md",
    "README.md",
    "build.mjs",
    "package.json",
    "src/index.ts",
    "src/manifest.ts",
    "src/protocol.ts",
    "tsconfig.json",
    "tsconfig.ui.json",
    "ui/index.html",
    "ui/main.ts",
  ]);
});

// The list is exhaustive, and one thing it must not grow is a LICENSE. Choosing a
// license is the author's to do, and a license file sitting in a fresh tree is what
// git, GitHub's detector, and every scanner read as the choice they made. The terms the
// template itself is offered under are recorded in this package's TEMPLATE-LICENSE.

// A written line, and specifically not a symlink: this tree gets committed, and git on
// Windows leaves core.symlinks off, so a clone there would hold the word "AGENTS.md"
// where the instructions should be. Writing it also keeps the emitted tree identical on
// every platform, which is what lets a second front door promise to match it.
test("gives the agent instructions the second name Claude Code looks for", async () => {
  const directory = target();

  await scaffold(options(directory));

  expect(lstatSync(join(directory, "CLAUDE.md")).isSymbolicLink()).toBe(false);
  expect(read(directory, "CLAUDE.md")).toBe("@AGENTS.md\n");
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

test("defaults the SDK range to the pinned one", async () => {
  const directory = target();

  await scaffold(options(directory));

  const pkg = JSON.parse(read(directory, "package.json")) as { dependencies: Record<string, string> };
  expect(pkg.dependencies["@timedomain/acestudio-extension-sdk"]).toBe(SDK_VERSION_RANGE);
});

// The drift gate behind that pin. The scaffolder cannot read the SDK's version at run
// time — it deliberately does not depend on it — so an SDK release that forgets to
// bump the constant would emit scaffolds pinned to a version that no longer exists.
test("the pinned SDK range tracks the SDK package beside it", async () => {
  const sdk = JSON.parse(
    await readFile(new URL("../../acestudio-extension-sdk/package.json", import.meta.url), "utf8"),
  ) as { version: string };

  expect(SDK_VERSION_RANGE).toBe(`^${sdk.version}`);
});

// Tracking the SDK is not enough on its own, because there is a version it can track that
// makes the caret meaningless: `^0.0.x` is `>=0.0.x <0.0.(x+1)`, a range satisfied by the one
// version it names. An SDK on a 0.0.x line would therefore emit scaffolds that no published
// fix can ever reach, and the smoke check cannot see that either, since it swaps this
// dependency for a local tarball on purpose. So the floor is asserted here, where it is cheap.
test("the SDK line the range points at is one a caret can actually widen over", async () => {
  const sdk = JSON.parse(
    await readFile(new URL("../../acestudio-extension-sdk/package.json", import.meta.url), "utf8"),
  ) as { version: string };

  expect(sdk.version.startsWith("0.0.")).toBe(false);
});

test("fits a value to the file it lands in, rather than refusing the characters", async () => {
  const directory = target();

  await scaffold(options(directory, { name: 'Stem "Pro" <Tools>' }));

  // JSON and TypeScript agree about a double-quoted string…
  expect(JSON.parse(read(directory, "package.json"))).toMatchObject({ description: 'Stem "Pro" <Tools> for ACE Studio' });
  expect(read(directory, "src/manifest.ts")).toContain('name: "Stem \\"Pro\\" <Tools>"');
  // …and the page gets entities, so a name with a bracket does not become markup.
  expect(read(directory, "ui/index.html")).toContain("<title>Stem &quot;Pro&quot; &lt;Tools&gt;</title>");
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
