import { parseEnvelope, verifyEnvelope, fromBase64 } from "@timedomain/workflowext-signed-json";
import { resolveChain } from "./chain";
import { checkCoverage, digestFiles, SIGNATURE_BLOCK_PATH, type ArchiveFile } from "./coverage";
import { parseSignatureBlockPayload } from "./payload";
import type { BundleVerdict, TrustedRoot } from "./verdict";

/**
 * The client's verdict on a bundle, per ADR 0089 §4-5: resolve the chain to
 * an embedded root, verify the block signature over exact stored bytes, only
 * then parse the payload, and check two-way per-file SHA-256 coverage.
 * Fail-closed: any step short of full success rejects.
 */
export async function verifySignedBundle(
  files: Iterable<ArchiveFile>,
  trustedRoots: TrustedRoot[],
): Promise<BundleVerdict> {
  const archive = Array.from(files);

  // Reject duplicate paths before anything else: digestFiles collapses by path
  // (last write wins) while the block/coverage lookups pick the first match, so
  // a duplicate could smuggle content past the digest it was checked against.
  const seen = new Set<string>();
  for (const file of archive) {
    if (seen.has(file.path)) {
      return { ok: false, reason: "duplicate-file", detail: file.path };
    }
    seen.add(file.path);
  }

  const block = archive.find((file) => file.path === SIGNATURE_BLOCK_PATH);
  if (block === undefined) {
    return { ok: false, reason: "missing-signature-block" };
  }

  const envelope = parseEnvelope(block.bytes);
  if (envelope === null) {
    return { ok: false, reason: "malformed-block" };
  }

  const chain = await resolveChain(envelope.chain, trustedRoots);
  if (!chain.ok) {
    return { ok: false, reason: "bad-chain", detail: chain.detail };
  }

  const signerPublicKey = fromBase64(chain.certificate.publicKey);
  const verified = await verifyEnvelope(signerPublicKey, envelope);
  if (!verified.ok) {
    return { ok: false, reason: verified.reason === "bad-signature" ? "bad-signature" : "malformed-block" };
  }

  const payload = parseSignatureBlockPayload(verified.payloadBytes);
  if (payload === null) {
    return { ok: false, reason: "invalid-payload" };
  }

  if (payload.signedAt < chain.certificate.validFrom) {
    return { ok: false, reason: "signer-not-yet-valid" };
  }

  const digests = await digestFiles(archive);
  const coverage = checkCoverage(digests, payload.files);
  if (!coverage.ok) {
    return { ok: false, reason: coverage.reason, detail: coverage.detail };
  }

  return { ok: true, payload };
}
