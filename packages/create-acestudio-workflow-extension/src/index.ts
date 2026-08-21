/**
 * The `npm create @timedomain/acestudio-workflow-extension` scaffolder for ACE Studio
 * workflow extensions.
 *
 * @remarks
 * One template, emitted whole: a TypeScript manifest, a typed-channel hello-world
 * UI, a build script that produces a loadable folder, and an `AGENTS.md` telling a
 * code agent how to build, load, observe, and debug the result. Nothing here needs a
 * running ACE Studio — the point is that the first build succeeds before the
 * developer has installed anything else.
 *
 * The scaffolding lives here rather than in the bin, so that `cli.ts` is argument
 * parsing and prompts and nothing more, and so that a test drives the emission
 * directly.
 *
 * @packageDocumentation
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The `@timedomain/acestudio-workflow-extension-sdk` release line a scaffold is built against.
 *
 * Pinned rather than derived. This scaffolder has no dependency on the SDK — that is
 * what lets `npm create` run it with nothing installed — so it cannot read the SDK's
 * version, and its own is not a stand-in: the workspace's packages carry independent
 * version lines. A test pins this to the SDK package beside it, so a bump that forgets
 * this constant fails there rather than in a scaffold whose `npm install` 404s.
 *
 * @public
 */
export const SDK_VERSION_RANGE = "^0.4.0";

/**
 * `developer-slug.extension-slug`, the id grammar the host enforces.
 *
 * Duplicated from `@timedomain/acestudio-workflow-extension-sdk` rather than imported: a
 * scaffolder that `npm create` runs straight from a tarball has no dependencies to
 * resolve, and one regex is a cheaper price than making the zero-install path
 * install the SDK to check a string. The SDK — and behind it the host — stays the
 * authority; this is the same gate moved earlier, and the scaffolded project's first
 * build runs the real one.
 */
const ID_PATTERN = /^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/;

/**
 * The publisher offered when the author has not named one, and — through
 * {@link defaultsFor} — the developer slug derived from it. Obviously a placeholder in
 * both places, which is the point: a default developer slug that looked plausible
 * would get signed under.
 */
const PLACEHOLDER_PUBLISHER = "Example Developer";

/**
 * Template files stored under a name npm will actually publish, and what they are
 * written as. npm drops a `.gitignore` from the packed tarball, so a template that
 * kept the real name would arrive at a user's machine missing it.
 */
const DOTFILES: Readonly<Record<string, string>> = { _gitignore: ".gitignore" };

/**
 * The agent instructions the scaffold emits, and the link target every other agent
 * filename points at. `AGENTS.md` is the cross-vendor name, so it holds the bytes.
 */
const AGENT_INSTRUCTIONS = "AGENTS.md";

/**
 * Something the scaffold will not do: a directory that is not the caller's to fill,
 * or an identity ACE Studio would refuse.
 *
 * @public
 */
export class ScaffoldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScaffoldError";
  }
}

/**
 * What the scaffold needs to know. Everything but the directory ends up in the
 * emitted manifest, which is what ACE Studio and the signing service read.
 *
 * @public
 */
export interface ScaffoldOptions {
  /** Where to write the extension. Created if missing; refused if it holds anything. */
  readonly directory: string;
  /** The extension id: `developer-slug.extension-slug`. */
  readonly id: string;
  /** The name ACE Studio shows the user. */
  readonly name: string;
  /** Who publishes it, shown beside the name. */
  readonly publisher: string;
  /** One line about what it does, for the install dialog. */
  readonly description?: string;
  /**
   * The SDK dependency range to write into the scaffold's `package.json`. Defaults to
   * {@link SDK_VERSION_RANGE}.
   */
  readonly sdkVersionRange?: string;
}

/**
 * What was written.
 *
 * @public
 */
export interface ScaffoldResult {
  /** The directory the extension was written into. */
  readonly directory: string;
  /** Every file written, as sorted directory-relative POSIX paths. */
  readonly files: readonly string[];
}

/**
 * The identity to offer when the author has not said: everything derived from the
 * directory they chose, plus the publisher if they gave one.
 *
 * Every field is a starting point rather than an answer — in particular the
 * developer slug, which ADR 0098 makes the developer's own choice and which the
 * signing service reads straight out of the manifest.
 *
 * @public
 */
export function defaultsFor(
  directory: string,
  publisher?: string,
): { id: string; name: string; packageName: string; publisher: string } {
  const packageName = toSlug(basename(directory)) || "my-extension";
  // One rule for the developer slug — it is the publisher's slug, whether the
  // publisher was given or defaulted — so the id a caller is offered always matches
  // the publisher beside it.
  const named = publisher ?? PLACEHOLDER_PUBLISHER;
  return {
    id: `${toSlug(named) || toSlug(PLACEHOLDER_PUBLISHER)}.${packageName}`,
    name: titleCase(packageName),
    packageName,
    publisher: named,
  };
}

/**
 * The `[a-z0-9-]` slug of some text: lower-cased, every run of anything else
 * collapsed to one dash, and no dash at either end. Empty when nothing survives,
 * which is a caller's cue to fall back rather than emit a bare dash.
 *
 * @public
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Write a working extension into `options.directory`.
 *
 * @throws ScaffoldError when the directory already holds something, or when the
 * identity is one ACE Studio would refuse at install.
 *
 * @public
 */
export async function scaffold(options: ScaffoldOptions): Promise<ScaffoldResult> {
  const { directory } = options;
  requireUsableIdentity(options);
  await requireEmptyDirectory(directory);

  const root = templateRoot();
  const substitutions = substitutionsFor(options);
  const written: string[] = [];

  for (const relative of await templateFiles(root)) {
    const emitted = emittedPath(relative);
    const template = await readFile(join(root, ...relative.split("/")), "utf8");
    const contents = substitute(template, substitutions, escapeFor(emitted));
    const destination = join(directory, ...emitted.split("/"));
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, contents, "utf8");
    written.push(emitted);
  }

  written.push(await writeAgentInstructionsAlias(directory));

  written.sort();
  return { directory, files: written };
}

/**
 * Give the agent instructions the second name Claude Code looks for.
 *
 * One line importing `AGENTS.md`, so both names reach the same text with nothing to
 * drift, and the space below the import stays free for anything meant only for Claude.
 *
 * A symlink says the same thing on the machine that runs the scaffolder, and not on the
 * author's next one: this tree gets committed, git on Windows leaves `core.symlinks`
 * off, and the clone there holds a file whose contents are the word `AGENTS.md`. A
 * written line clones identically everywhere, which also keeps the emitted tree free of
 * anything platform-shaped for a second front door to have to reproduce.
 */
async function writeAgentInstructionsAlias(directory: string): Promise<string> {
  const emitted = "CLAUDE.md";
  await writeFile(join(directory, emitted), `@${AGENT_INSTRUCTIONS}\n`, "utf8");
  return emitted;
}

/** Everything the author can be wrong about, checked before anything is written. */
function requireUsableIdentity(options: ScaffoldOptions): void {
  if (!ID_PATTERN.test(options.id)) {
    throw new ScaffoldError(
      `"${options.id}" is not an extension id — write developer-slug.extension-slug, two lowercase ` +
        "[a-z0-9-] slugs joined by one dot (an id is an identity, not a domain, so no reverse-domain names)",
    );
  }
  for (const [field, value] of [
    ["name", options.name],
    ["publisher", options.publisher],
  ] as const) {
    if (value.trim().length === 0) {
      throw new ScaffoldError(`"${field}" is what ACE Studio shows the user, so it cannot be blank`);
    }
  }
}

/**
 * Refuse a directory with anything in it. A scaffold is a whole tree, not a merge:
 * writing it over somebody's work would replace files they never named, and there is
 * no `--force` because the honest recovery is to pick another directory.
 */
async function requireEmptyDirectory(directory: string): Promise<void> {
  let entries: string[];
  try {
    entries = await readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }
    throw error;
  }
  if (entries.length > 0) {
    throw new ScaffoldError(`${directory} is not empty — scaffold into a new directory`);
  }
}

/** Where the templates sit relative to this module, in source and in the bundle alike. */
function templateRoot(): string {
  return fileURLToPath(new URL("../templates/default/", import.meta.url));
}

/** Every template file, as root-relative POSIX paths. */
async function templateFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).slice(root.length).split(sep).join("/"));
}

/** The name a template file is written under — dotfiles restored. */
function emittedPath(relative: string): string {
  const segments = relative.split("/");
  const last = segments[segments.length - 1] as string;
  segments[segments.length - 1] = DOTFILES[last] ?? last;
  return segments.join("/");
}

function substitutionsFor(options: ScaffoldOptions): Record<string, string> {
  const name = options.name.trim();
  const extensionSlug = options.id.split(".")[1] as string;
  const description = options.description?.trim();
  return {
    extensionId: options.id,
    extensionName: name,
    extensionSlug,
    packageName: toSlug(basename(options.directory)) || extensionSlug,
    protocolType: protocolTypeName(extensionSlug),
    publisher: options.publisher.trim(),
    description: description === undefined || description.length === 0 ? `${name} for ACE Studio` : description,
    sdkVersionRange: options.sdkVersionRange ?? SDK_VERSION_RANGE,
  };
}

/** How a substituted value is made safe for the file it is landing in. */
type Escape = (value: string) => string;

/**
 * The escaping each kind of template file needs. A display name is the author's to
 * write, quotes and angle brackets included, so the value is fitted to its
 * destination rather than the author being told what characters they may use.
 *
 * JSON and TypeScript agree about double-quoted strings, which is every substitution
 * site in `package.json` and `src/manifest.ts`. HTML gets entities. Markdown and the
 * rest take the value as written: it is prose there, and escaping it would show.
 */
const ESCAPES: Readonly<Record<string, Escape>> = {
  ".json": (value) => JSON.stringify(value).slice(1, -1),
  ".ts": (value) => JSON.stringify(value).slice(1, -1),
  ".mjs": (value) => JSON.stringify(value).slice(1, -1),
  // Quotes as well as brackets, though today's sites are all element text where a
  // quote is harmless: a later template that puts a name in an attribute should not
  // have to remember to come back here.
  ".html": (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;"),
};

const VERBATIM: Escape = (value) => value;

function escapeFor(path: string): Escape {
  return ESCAPES[extname(path)] ?? VERBATIM;
}

/**
 * Replace every `{{name}}` with its substitution, escaped for where it lands. A token
 * nobody supplied is left as it was rather than blanked, so a typo in a template shows
 * up as itself in the output — which is what lets a test catch it by grepping the
 * emitted tree.
 */
function substitute(contents: string, substitutions: Readonly<Record<string, string>>, escape: Escape): string {
  return contents.replace(/\{\{(\w+)\}\}/g, (whole: string, name: string) => {
    const value = substitutions[name];
    return value === undefined ? whole : escape(value);
  });
}

/**
 * The name of the scaffold's protocol interface, from the extension slug:
 * `stem-tools` → `StemToolsUi`. Prefixed when the slug starts with a digit, which the
 * id grammar allows and an identifier does not.
 */
function protocolTypeName(extensionSlug: string): string {
  const pascal = titleCase(extensionSlug).replace(/ /g, "");
  return `${/^\d/.test(pascal) ? "Ext" : ""}${pascal}Ui`;
}

/** `stem-tools` → `Stem Tools`. Only ever a suggestion the author can overwrite. */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
