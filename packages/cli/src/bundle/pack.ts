import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { isValidArchivePath } from "@timedomain/workflowext-verifier";
import { developerIdOf } from "../credentials/developer-id";
import { BUNDLE_EXTENSION } from "./constants";
import type { ZipFile } from "./zip";

export class PackError extends Error {}

const MANIFEST_PATH = "manifest.json";

/**
 * Reads a source directory into the file set for an unsigned bundle. Entries
 * are archive-relative POSIX paths; only regular files are included, so a
 * symlink can never pull content from outside the tree into the bundle. The
 * order is sorted and the caller stamps a fixed modified-at, so packing is
 * reproducible.
 */
export async function packDir(dir: string): Promise<ZipFile[]> {
  const files: ZipFile[] = [];
  await walk(dir, dir, files);
  if (files.length === 0) {
    throw new PackError(`no files found under ${dir}`);
  }
  for (const file of files) {
    if (file.path.startsWith("_signature/") || file.path === "_signature") {
      throw new PackError(
        `"${file.path}" is reserved for the signature block; the service inserts it — pack the unsigned tree`,
      );
    }
    if (!isValidArchivePath(file.path)) {
      throw new PackError(`archive path is not allowed: ${file.path}`);
    }
  }
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return files;
}

async function walk(root: string, dir: string, out: ZipFile[]): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(root, abs, out);
    } else if (entry.isFile()) {
      // sep → "/" so archive paths are POSIX regardless of host OS.
      const path = relative(root, abs).split(sep).join("/");
      out.push({ path, bytes: new Uint8Array(await readFile(abs)) });
    }
    // Symlinks, sockets, and devices are skipped — a bundle carries file
    // content, and following a symlink could escape the tree.
  }
}

/**
 * The extension slug of an id — the segment after the developer slug, the way
 * the service reads it (`extensionId.split(".")[1]`). Ids that don't fit the
 * `developer-slug.extension-slug` shape fall back to the whole id.
 */
export function extensionSlug(extensionId: string): string {
  const parts = extensionId.split(".");
  return parts.length >= 2 && parts[1]!.length > 0 ? parts[1]! : extensionId;
}

/**
 * The developer id a bundle's manifest declares — the first segment of its
 * `id`. The service requires this to equal the developer id its credential
 * resolves to, so reading it lets the CLI say *which* namespaces disagree
 * instead of relaying a bare 403. A tolerant read, like `deriveBundleName`:
 * an unreadable manifest yields null and the check is simply skipped.
 */
export function deriveDeveloperId(files: readonly ZipFile[]): string | null {
  const id = manifestField(files, "id");
  return id === null ? null : developerIdOf(id);
}

function manifestField(files: readonly ZipFile[], key: string): string | null {
  const manifest = files.find((file) => file.path === MANIFEST_PATH);
  if (manifest === undefined) return null;
  let value: unknown;
  try {
    value = JSON.parse(new TextDecoder().decode(manifest.bytes));
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" ? field : null;
}

/**
 * The output name the service also derives from the manifest:
 * `<extension-slug>-<version>.aceworkflow`. A tolerant read — the service is
 * the authority on manifest validity — so a malformed manifest just yields no
 * name and the caller falls back or requires `-o`.
 */
export function deriveBundleName(files: readonly ZipFile[]): string | null {
  const manifest = files.find((file) => file.path === MANIFEST_PATH);
  if (manifest === undefined) return null;
  let value: unknown;
  try {
    value = JSON.parse(new TextDecoder().decode(manifest.bytes));
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || typeof record.version !== "string") return null;
  const slug = extensionSlug(record.id);
  if (slug.length === 0) return null;
  return `${slug}-${record.version}${BUNDLE_EXTENSION}`;
}
