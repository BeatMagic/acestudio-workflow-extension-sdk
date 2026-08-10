/**
 * The extension manifest, as a TypeScript module.
 *
 * @remarks
 * An extension's manifest is authored as TypeScript and *emitted* as JSON: the
 * `.aceworkflow` bundle carries `manifest.json` at its root, and ACE Studio and
 * the signing service read only that. A typed module is what makes the manifest
 * worth having in TypeScript at all — a JSON import cannot carry literal types,
 * and the capability list has to stay literal for {@link ManifestClient} to type
 * a handler's client down to it.
 *
 * Author it `as const satisfies ExtensionManifest`: `satisfies` type-checks every
 * field (and rejects a stray one, including the reserved `operations`), while
 * `as const` keeps the capability names as literals.
 *
 * ```ts
 * export const manifest = {
 *   id: "acme.stem-tools",
 *   name: "Stem Tools",
 *   version: "1.0.0",
 *   publisher: "Acme Audio",
 *   lifecycle: "one-shot",
 *   capabilities: ["clip.read", "export.invoke"],
 *   entry: "dist/index.js",
 * } as const satisfies ExtensionManifest;
 * ```
 */

import type { CapabilityToken } from "@timedomain/acestudio-bridge-core";

/**
 * The bundle-format version this SDK emits. A hard forward-compatibility gate on
 * the host: a Studio that does not know a version refuses the bundle rather than
 * guessing at it.
 *
 * @public
 */
export const MANIFEST_VERSION = 1;

/**
 * The extension-SDK major version an extension built against this package
 * declares. The host keeps a supported-majors range and refuses a bundle outside
 * it, so an extension never half-runs on an incompatible Studio.
 *
 * It is stamped by {@link serializeManifest} rather than authored: it describes
 * which SDK built the bundle, which is something the SDK knows and an author can
 * only restate — or get wrong.
 *
 * @public
 */
export const SDK_API_VERSION = 1;

/**
 * What an extension may ask for: an atomic capability token.
 *
 * The request is what the user consents to at install, and the resulting grant is
 * fixed there — so this list is also the extension's whole reach for as long as
 * it stays installed at this version.
 *
 * A Surface Profile is deliberately **not** one of these. A `surface.*` name is
 * the ceiling Studio grants a whole consumer class within — it computes
 * `requested ∩ ceiling` — so nothing requests one, and the host refuses a
 * manifest that names one at parse rather than resolving it to nothing. The
 * generated `PROFILES` table holds those ceilings, which is why `ProfileName` is
 * not part of this union: it is the type you measure a grant *against*
 * (`grant.missing`, `connection.scoped`), not one you ask with.
 *
 * @public
 */
export type RequestedCapability = CapabilityToken;

/**
 * How a workflow's process is run (the lifecycle resolution's two policies on one
 * runtime model):
 *
 * - `one-shot` — spawned to run its work through, and reaped when it finishes.
 * - `persistent` — a long-lived peer, spawned when the user opens its surface,
 *   alive until stopped.
 *
 * @public
 */
export type ExtensionLifecycle = "one-shot" | "persistent";

/**
 * A filesystem scope Studio can name in a consent line on its own, without
 * printing a path: the project's media set, a well-known user folder, or the
 * whole filesystem.
 *
 * `projectMedia` is read-only by definition — project media changes through
 * operations on the bridge, never by writing files behind Studio's back — so it
 * is not accepted under `write`.
 *
 * @public
 */
export type EnumeratedFilesystemScope =
  | "projectMedia"
  | "home"
  | "documents"
  | "music"
  | "desktop"
  | "downloads"
  | "all";

/**
 * A single letter, either case — the only thing before the colon that the host
 * reads as a drive. Spelled out because a template literal type cannot say "one
 * letter" any other way, and `${string}:` would admit `Disk:/Stems`.
 *
 * @public
 */
export type DriveLetter = Lowercase<UppercaseDriveLetter> | UppercaseDriveLetter;

/**
 * The upper-case half of {@link DriveLetter}, listed once so the lower-case half can
 * be derived from it.
 *
 * @public
 */
export type UppercaseDriveLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

/**
 * An absolute path, POSIX or Windows — the scope form a static manifest cannot
 * enumerate, rendered verbatim in the consent line. The host is the authority on
 * what counts as absolute; {@link serializeManifest} rejects the forms it can
 * tell are neither absolute nor a known scope name.
 *
 * Three forms, matching what the host accepts: a POSIX root, a UNC share (two
 * leading backslashes), and a drive letter with its separator. A single leading
 * backslash is deliberately not one of them — on Windows that path is relative to
 * the current drive, so it names a different folder depending on where the process
 * happens to be, which is not something a consent line can vouch for. A bare drive
 * prefix (`D:Stems`) is out for the same reason.
 *
 * @public
 */
export type AbsoluteFilesystemPath = `/${string}` | `\\\\${string}` | `${DriveLetter}:${"/" | "\\"}${string}`;

/**
 * One declared filesystem scope: a scope name, a `project:`-prefixed subpath of
 * the open project's bundle folder, or an absolute path.
 *
 * @public
 */
export type FilesystemScope = EnumeratedFilesystemScope | `project:${string}` | AbsoluteFilesystemPath;

/**
 * What an extension's *process* may reach, per direction. `"all"` in place of a
 * list asks for the whole filesystem in that direction.
 *
 * Declared scopes are rare on purpose: a file the user picks in the extension's
 * page arrives as content over the page↔process channel, exactly as it would in a
 * browser, and needs no declaration. This block is for *programmatic* path access
 * — watching a folder, re-exporting to the same directory every run.
 *
 * @public
 */
export interface FilesystemAccess {
  /** Paths and scopes the process may read. */
  readonly read?: readonly FilesystemScope[] | "all";
  /** Paths and scopes the process may write. `projectMedia` is not one of them. */
  readonly write?: readonly FilesystemScope[] | "all";
}

/**
 * The second axis of what an extension may do, beside its capability tokens: what
 * its process may touch. A capability token gates an operation on the bridge; a
 * host-access declaration gates the process itself.
 *
 * Every latch is a real ability some extensions genuinely need, off by default and
 * consented at install with an honest warning — the declaration exists so the
 * author states what they use and the user sees what they are allowing, not to
 * gatekeep. The latches are orthogonal: turning one on never widens
 * {@link HostAccess.filesystem}.
 *
 * @public
 */
export interface HostAccess {
  /** Filesystem reach beyond the extension's own data, scratch, and log folders. */
  readonly filesystem?: FilesystemAccess;
  /** Run other programs. What they touch is outside the declared file scopes. */
  readonly childProcess?: boolean;
  /** Load native (`.node`) modules, which run outside the declared limits. */
  readonly nativeAddons?: boolean;
  /** Run worker threads. */
  readonly workers?: boolean;
  /** Use the WebAssembly System Interface. */
  readonly wasi?: boolean;
}

/**
 * The manifest an extension author writes.
 *
 * Two fields of the emitted JSON are deliberately absent here — `manifestVersion`
 * and `sdkApiVersion`, which describe the bundle format and the SDK that built
 * the bundle. {@link serializeManifest} stamps both.
 *
 * @public
 */
export interface ExtensionManifest {
  /**
   * The stable extension id, `developer-slug.extension-slug`: two lowercase
   * `[a-z0-9-]` slugs joined by one dot, each starting with a letter or digit.
   * It is an identity, not a domain — a reverse-domain id is refused, since
   * nobody checks domain ownership.
   */
  readonly id: string;
  /** The name Studio shows the user, in the workflow window's chrome and the install dialog. */
  readonly name: string;
  /** The extension's own version, as semver. An update that widens the capability request re-prompts for consent. */
  readonly version: string;
  /** Who publishes it, shown beside the name. */
  readonly publisher: string;
  /** Which lifecycle policy this workflow runs under. */
  readonly lifecycle: ExtensionLifecycle;
  /**
   * The capability tokens to request. The install dialog renders this list, and the
   * handlers' client is typed down to exactly it — so a capability that is not here
   * is a compile error at the call rather than a refusal at run time.
   *
   * Tokens, with no expansion step: a `surface.*` ceiling is not a capability to
   * request, and the host refuses a manifest that names one. See
   * {@link RequestedCapability}.
   */
  readonly capabilities: readonly RequestedCapability[];
  /**
   * The bundle-relative path of the script Studio runs — the module that calls
   * {@link defineExtension}. Relative to the bundle root, never absolute and
   * never climbing out of it.
   */
  readonly entry: string;
  /**
   * The process's working directory, bundle-relative. Defaults to the entry
   * script's own directory, which is not necessarily the bundle root.
   */
  readonly cwd?: string;
  /** One line about what the extension does, for the install dialog. */
  readonly description?: string;
  /** A bundle-relative path to the icon Studio shows beside the name. */
  readonly icon?: string;
  /** What the extension's process may reach beyond the default box. */
  readonly hostAccess?: HostAccess;
}

/**
 * The manifest as it lands in the bundle: what the author wrote, plus the two
 * versions the SDK stamps. This is the JSON ACE Studio and the signing service
 * parse — the shape is theirs, so the order of keys here is the order
 * {@link serializeManifest} emits.
 *
 * @public
 */
export interface ManifestJson extends ExtensionManifest {
  /** The bundle-format version — {@link MANIFEST_VERSION}. */
  readonly manifestVersion: number;
  /** The SDK major the bundle was built against — {@link SDK_API_VERSION}. */
  readonly sdkApiVersion: number;
}
