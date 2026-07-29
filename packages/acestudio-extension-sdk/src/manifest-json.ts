/**
 * Emitting `manifest.json` from the TypeScript manifest.
 *
 * @remarks
 * The TypeScript module is the source of truth; this is the build step that puts
 * the JSON ACE Studio and the signing service read into the bundle. The signature
 * covers the emitted bytes, so the emission is deterministic: the same manifest
 * always produces the same file, key order included.
 *
 * The checks here are a transcription of the host's own manifest gates — the id
 * grammar, semver, the bundle-relative path guard, the reserved `operations` key,
 * the `hostAccess` shapes. Not because this side is the authority (it is not: the
 * host parses the JSON and refuses an install it does not like), but because the
 * feedback belongs at build time, where the author is, rather than at install time
 * on someone else's machine. Everything the host refuses, this refuses first, and
 * with every problem listed rather than only the first one found.
 *
 * Capability *names* are the exception: they are not checked against the roster
 * this SDK was generated from, because the registry moves faster than a pinned
 * copy of the bindings, and a token minted after this SDK's release is a perfectly
 * good thing to request. The host resolves the request; TypeScript is what catches
 * the typo.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ExtensionError } from "./errors.js";
import {
  MANIFEST_VERSION,
  SDK_API_VERSION,
  type EnumeratedFilesystemScope,
  type ExtensionManifest,
  type ManifestJson,
} from "./manifest.js";

/**
 * The manifest's filename at the bundle root. The host looks for exactly this.
 *
 * @public
 */
export const MANIFEST_FILENAME = "manifest.json";

/**
 * `developer-slug.extension-slug`: two lowercase `[a-z0-9-]` slugs joined by one
 * dot, each starting alphanumeric. Excluding separators, a leading dot, and `..`
 * is what makes the id safe as a single path component, which the install store
 * relies on.
 */
const ID_PATTERN = /^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/;

/** Semver 2.0.0: `major.minor.patch` with no leading zeroes, plus optional pre-release and build metadata. */
const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

/** A POSIX root, a UNC share, or a Windows drive with its separator. */
const ABSOLUTE_PATTERN = /^(?:\/|\\\\|[A-Za-z]:[/\\])/;

/** The lifecycle policies the host runs. */
const LIFECYCLES = new Set(["one-shot", "persistent"]);

/** Scopes Studio can name in a consent line without printing a path. */
const ENUMERATED_SCOPES = new Set<EnumeratedFilesystemScope>([
  "projectMedia",
  "home",
  "documents",
  "music",
  "desktop",
  "downloads",
  "all",
]);

/** The `hostAccess` boolean latches, each 1:1 with a Node permission-model flag. */
const HOST_ACCESS_LATCHES = ["childProcess", "nativeAddons", "workers", "wasi"] as const;

/**
 * Every key the emitter knows, in the order the JSON carries them. Emitting from
 * this list rather than by spreading the author's object is what makes the output
 * byte-stable, and what turns a misspelled field into a build error instead of a
 * key the host silently ignores.
 */
const AUTHORED_KEYS = [
  "id",
  "name",
  "version",
  "publisher",
  "lifecycle",
  "capabilities",
  "entry",
  "cwd",
  "description",
  "icon",
  "hostAccess",
] as const satisfies readonly (keyof ExtensionManifest)[];

/**
 * The manifest as JSON, ready for the bundle root: `manifestVersion` and
 * `sdkApiVersion` stamped, keys in a fixed order, one trailing newline.
 *
 * @throws ExtensionError listing every problem the host would refuse this manifest
 * for.
 *
 * @public
 */
export function serializeManifest(manifest: ExtensionManifest): string {
  return `${JSON.stringify(toManifestJson(manifest), null, 2)}\n`;
}

/**
 * Write `manifest.json` into `outputDir` (creating it if needed) and return the
 * path written. The one call an extension's build script needs.
 *
 * @throws ExtensionError if the manifest would not install.
 *
 * @public
 */
export async function writeManifestJson(manifest: ExtensionManifest, outputDir: string): Promise<string> {
  // Serialized before the directory is touched, so a manifest that will not
  // install leaves nothing behind.
  const json = serializeManifest(manifest);
  const path = join(outputDir, MANIFEST_FILENAME);
  await mkdir(outputDir, { recursive: true });
  await writeFile(path, json, "utf8");
  return path;
}

/** The validated manifest object the JSON is rendered from. */
function toManifestJson(manifest: ExtensionManifest): ManifestJson {
  const problems = validate(manifest);
  if (problems.length > 0) {
    throw new ExtensionError(
      `this manifest would not install: ${problems.join("; ")}`,
      { hint: "ACE Studio refuses a manifest it cannot read rather than guessing at it" },
    );
  }

  // Built key by key in the host's reading order rather than spread, so the bytes
  // the signature covers do not depend on the order the author happened to write.
  const json: Record<string, unknown> = {
    manifestVersion: MANIFEST_VERSION,
    sdkApiVersion: SDK_API_VERSION,
  };
  for (const key of AUTHORED_KEYS) {
    const value = manifest[key];
    if (value !== undefined) {
      json[key] = value;
    }
  }
  return json as unknown as ManifestJson;
}

/** Everything wrong with a manifest, in the order the fields are declared. */
function validate(manifest: ExtensionManifest): string[] {
  const problems: string[] = [];
  const record = manifest as unknown as Record<string, unknown>;

  // The reserved key, first: it is the one field whose *presence* is the problem,
  // and the v1 host rejects it outright rather than ignoring it, so that an
  // extension declaring operations can never look like it works on a Studio that
  // has no idea what they are.
  if ("operations" in record) {
    problems.push('"operations" is reserved for a later ACE Studio and is refused by this one');
  }
  for (const key of Object.keys(record)) {
    if (key !== "operations" && !(AUTHORED_KEYS as readonly string[]).includes(key)) {
      problems.push(`"${key}" is not a manifest field this SDK knows`);
    }
  }

  if (typeof manifest.id !== "string" || !ID_PATTERN.test(manifest.id)) {
    problems.push(`"id" must read developer-slug.extension-slug, got ${JSON.stringify(manifest.id)}`);
  }
  requireText("name", manifest.name, problems);
  if (typeof manifest.version !== "string" || !SEMVER_PATTERN.test(manifest.version)) {
    problems.push(`"version" must be a semantic version, got ${JSON.stringify(manifest.version)}`);
  }
  requireText("publisher", manifest.publisher, problems);
  if (!LIFECYCLES.has(manifest.lifecycle)) {
    problems.push(`"lifecycle" must be "one-shot" or "persistent", got ${JSON.stringify(manifest.lifecycle)}`);
  }
  validateCapabilities(manifest.capabilities, problems);
  validateBundlePath("entry", manifest.entry, problems, { required: true });
  validateBundlePath("cwd", manifest.cwd, problems, { required: false });
  validateBundlePath("icon", manifest.icon, problems, { required: false });
  if (manifest.description !== undefined && typeof manifest.description !== "string") {
    problems.push('"description" must be a string');
  }
  if (manifest.hostAccess !== undefined) {
    validateHostAccess(manifest.hostAccess, problems);
  }

  return problems;
}

function requireText(field: string, value: unknown, problems: string[]): void {
  if (typeof value !== "string" || value.length === 0) {
    problems.push(`"${field}" must be a non-empty string`);
  }
}

/**
 * The capability request has to be a list of names, and a non-empty one: an
 * extension that asks for nothing can still run (ungated operations are reachable
 * by any session), so an empty list is legal — an *absent* one is not.
 */
function validateCapabilities(capabilities: unknown, problems: string[]): void {
  if (!Array.isArray(capabilities)) {
    problems.push('"capabilities" must be an array of capability tokens and/or profile names');
    return;
  }
  for (const [index, capability] of capabilities.entries()) {
    if (typeof capability !== "string" || capability.length === 0) {
      problems.push(`"capabilities[${index}]" must be a non-empty capability name`);
    }
  }
}

/**
 * A path inside the bundle: relative, and staying there. The host resolves these
 * against the bundle root and refuses one that climbs out — a manifest cannot be
 * what points Studio at an arbitrary script on disk.
 */
function validateBundlePath(
  field: string,
  value: string | undefined,
  problems: string[],
  { required }: { required: boolean },
): void {
  if (value === undefined) {
    if (required) {
      problems.push(`"${field}" is required`);
    }
    return;
  }
  if (typeof value !== "string" || value.length === 0) {
    problems.push(`"${field}" must be a non-empty bundle-relative path`);
    return;
  }
  if (ABSOLUTE_PATTERN.test(value)) {
    problems.push(`"${field}" must be bundle-relative, not absolute: ${value}`);
    return;
  }
  if (climbsOut(value)) {
    problems.push(`"${field}" must stay inside the bundle: ${value}`);
  }
}

/** Whether a relative path walks out of the tree it is rooted in. */
function climbsOut(path: string): boolean {
  return path
    .replace(/\\/g, "/")
    .split("/")
    .some((segment) => segment === "..");
}

/** The `hostAccess` block: known keys only, and every scope in a form Studio can consent to. */
function validateHostAccess(hostAccess: unknown, problems: string[]): void {
  if (typeof hostAccess !== "object" || hostAccess === null || Array.isArray(hostAccess)) {
    problems.push('"hostAccess" must be an object');
    return;
  }
  const record = hostAccess as Record<string, unknown>;
  const known = new Set<string>(["filesystem", ...HOST_ACCESS_LATCHES]);
  for (const key of Object.keys(record)) {
    if (!known.has(key)) {
      // Fail loud rather than drop: a latch nobody validates is a latch nobody
      // consents to, and the extension would find out by being denied at run time.
      problems.push(`"hostAccess.${key}" is not a host-access field this SDK knows`);
    }
  }
  for (const latch of HOST_ACCESS_LATCHES) {
    if (record[latch] !== undefined && typeof record[latch] !== "boolean") {
      problems.push(`"hostAccess.${latch}" must be a boolean`);
    }
  }
  if (record.filesystem === undefined) {
    return;
  }
  if (typeof record.filesystem !== "object" || record.filesystem === null || Array.isArray(record.filesystem)) {
    problems.push('"hostAccess.filesystem" must be an object with "read" and/or "write"');
    return;
  }
  const filesystem = record.filesystem as Record<string, unknown>;
  for (const key of Object.keys(filesystem)) {
    if (key !== "read" && key !== "write") {
      problems.push(`"hostAccess.filesystem.${key}" is not a direction; use "read" or "write"`);
    }
  }
  validateDirection("read", filesystem.read, problems);
  validateDirection("write", filesystem.write, problems);
}

function validateDirection(direction: "read" | "write", value: unknown, problems: string[]): void {
  if (value === undefined) {
    return;
  }
  const field = `hostAccess.filesystem.${direction}`;
  if (value === "all") {
    return;
  }
  if (!Array.isArray(value)) {
    problems.push(`"${field}" must be an array of scopes, or the string "all"`);
    return;
  }
  for (const [index, scope] of value.entries()) {
    validateScope(`${field}[${index}]`, scope, direction === "write", problems);
  }
}

function validateScope(field: string, scope: unknown, write: boolean, problems: string[]): void {
  if (typeof scope !== "string" || scope.length === 0) {
    problems.push(`"${field}" must be a non-empty scope name or path`);
    return;
  }
  if (scope.startsWith("project:")) {
    const subPath = scope.slice("project:".length);
    if (subPath.length === 0 || ABSOLUTE_PATTERN.test(subPath) || climbsOut(subPath)) {
      problems.push(`"${field}" must name a path inside the project: ${scope}`);
    }
    return;
  }
  if (ABSOLUTE_PATTERN.test(scope)) {
    return;
  }
  if (!ENUMERATED_SCOPES.has(scope as EnumeratedFilesystemScope)) {
    problems.push(
      `"${field}" is not a known scope: ${scope} — use one of ${[...ENUMERATED_SCOPES].join(", ")}, ` +
        "a project: subpath, or an absolute path",
    );
    return;
  }
  if (write && scope === "projectMedia") {
    problems.push(
      '"hostAccess.filesystem.write" cannot list projectMedia: project media is read-only, and changing it ' +
        "goes through operations on the bridge",
    );
  }
}
