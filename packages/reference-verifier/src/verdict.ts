import type { SignatureBlockPayload } from "@timedomain/workflowext-wire-schemas";

export type RejectReason =
  | "missing-signature-block"
  | "malformed-block"
  | "bad-chain"
  | "bad-signature"
  | "invalid-payload"
  | "signer-not-yet-valid"
  | "duplicate-file"
  | "file-hash-mismatch"
  | "unlisted-file"
  | "missing-file";

export type BundleVerdict =
  | { ok: true; payload: SignatureBlockPayload }
  | { ok: false; reason: RejectReason; detail?: string };

/** An embedded root public key a client build ships with. */
export interface TrustedRoot {
  keyId: string;
  /** Raw 32-byte Ed25519 public key. */
  publicKey: Uint8Array;
}
