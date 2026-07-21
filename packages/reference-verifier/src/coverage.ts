import { sha256Hex } from "@timedomain/workflowext-signed-json";

export const SIGNATURE_BLOCK_PATH = "_signature/block.json";

export type CoverageVerdict =
  | { ok: true }
  | { ok: false; reason: "file-hash-mismatch" | "unlisted-file" | "missing-file"; detail: string };

export interface ArchiveFile {
  path: string;
  bytes: Uint8Array;
}

export async function digestFiles(files: Iterable<ArchiveFile>): Promise<Map<string, string>> {
  const digests = new Map<string, string>();
  for (const file of files) {
    digests.set(file.path, await sha256Hex(file.bytes));
  }
  return digests;
}

/**
 * Exact two-way coverage (ADR 0089 §5): every archive file except the
 * signature block appears in the signed map, and every map entry exists in
 * the archive — no smuggled files, no missing files. `archiveDigests` must
 * include every archive entry; only `_signature/block.json` itself is exempt,
 * so anything else under the reserved `_signature/` directory is unlisted.
 */
export function checkCoverage(
  archiveDigests: ReadonlyMap<string, string>,
  signedFiles: Readonly<Record<string, string>>,
): CoverageVerdict {
  for (const [path, digest] of archiveDigests) {
    if (path === SIGNATURE_BLOCK_PATH) continue;
    // Own-property check: a path like "constructor" must read as unlisted,
    // never resolve through the prototype chain.
    if (!Object.hasOwn(signedFiles, path)) {
      return { ok: false, reason: "unlisted-file", detail: path };
    }
    const signedDigest = signedFiles[path];
    if (signedDigest !== digest) {
      return { ok: false, reason: "file-hash-mismatch", detail: path };
    }
  }
  for (const path of Object.keys(signedFiles)) {
    if (!archiveDigests.has(path)) {
      return { ok: false, reason: "missing-file", detail: path };
    }
  }
  return { ok: true };
}
