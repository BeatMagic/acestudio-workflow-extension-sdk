import {
  parseCertificatePayload,
  verifyEnvelope,
  type CertificatePayload,
  type SignedEnvelope,
} from "@beatmagic/workflowext-signed-json";
import type { TrustedRoot } from "./verdict";

export type ChainResolution =
  | { ok: true; certificate: CertificatePayload; root: TrustedRoot }
  | { ok: false; detail: string };

/**
 * Resolves a signature's cert chain to an embedded root: the chain's single
 * certificate (v1) must verify under one of the embedded root public keys and
 * certify an intermediate-role key. The certificate payload is parsed only
 * after its signature has been verified.
 */
export async function resolveChain(
  chain: SignedEnvelope[] | undefined,
  trustedRoots: TrustedRoot[],
): Promise<ChainResolution> {
  if (chain === undefined || chain.length !== 1) {
    return { ok: false, detail: "chain must contain exactly one certificate" };
  }
  const certificateEnvelope = chain[0];

  for (const root of trustedRoots) {
    const verdict = await verifyEnvelope(root.publicKey, certificateEnvelope);
    if (!verdict.ok) continue;

    const certificate = parseCertificatePayload(verdict.payloadBytes);
    if (certificate === null) {
      return { ok: false, detail: "certificate payload is not a valid certificate statement" };
    }
    if (certificate.role !== "intermediate") {
      return { ok: false, detail: `certified key has role "${certificate.role}", expected "intermediate"` };
    }
    return { ok: true, certificate, root };
  }
  return { ok: false, detail: "certificate verifies under no embedded root" };
}
