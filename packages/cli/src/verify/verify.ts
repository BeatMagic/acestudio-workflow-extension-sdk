import { verifySignedBundle, type BundleVerdict, type TrustedRoot } from "@beatmagic/workflowext-verifier";
import { ZIP_LIMITS } from "../bundle/constants";
import { readZip, ZipError } from "../bundle/zip";

export type VerifyResult =
  | { ok: true; verdict: Extract<BundleVerdict, { ok: true }> }
  | { ok: false; verdict: Extract<BundleVerdict, { ok: false }> }
  | { ok: false; malformed: string };

/**
 * Reads a signed bundle and runs the reference verifier over its exact stored
 * entries — the same verdict a real client reaches (ADR 0089 §4-5). The zip
 * entries are `{ path, bytes }`, which is already the verifier's `ArchiveFile`
 * shape, so nothing is re-serialized between reading and verifying.
 */
export async function verifyBundleBytes(bytes: Uint8Array, roots: TrustedRoot[]): Promise<VerifyResult> {
  let files;
  try {
    files = await readZip(bytes, ZIP_LIMITS);
  } catch (error) {
    if (error instanceof ZipError) return { ok: false, malformed: error.message };
    throw error;
  }
  const verdict = await verifySignedBundle(files, roots);
  return verdict.ok ? { ok: true, verdict } : { ok: false, verdict };
}
