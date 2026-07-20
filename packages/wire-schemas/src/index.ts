import certificateStatementSchema from "../schemas/certificate-statement.v1.schema.json";
import keyDirectorySchema from "../schemas/key-directory.v1.schema.json";
import revocationListSchema from "../schemas/revocation-list.v1.schema.json";
import rootRevocationStatementSchema from "../schemas/root-revocation-statement.v1.schema.json";
import signatureBlockSchema from "../schemas/signature-block.v1.schema.json";
import trustRegistrySchema from "../schemas/trust-registry.v1.schema.json";
import type { SignedEnvelope } from "@beatmagic/workflowext-signed-json";

export {
  certificateStatementSchema,
  keyDirectorySchema,
  revocationListSchema,
  rootRevocationStatementSchema,
  signatureBlockSchema,
  trustRegistrySchema,
};

export const ALL_SCHEMAS = [
  signatureBlockSchema,
  certificateStatementSchema,
  keyDirectorySchema,
  trustRegistrySchema,
  revocationListSchema,
  rootRevocationStatementSchema,
] as const;

// Format discriminators carried by every signed payload (domain separation).
// The certificate format constant lives with the crypto core.
export { CERTIFICATE_FORMAT, type CertificatePayload, type KeyRole } from "@beatmagic/workflowext-signed-json";
export const SIGNATURE_BLOCK_FORMAT = "acestudio.workflowext.signature-block";
export const KEY_DIRECTORY_FORMAT = "acestudio.workflowext.key-directory";
export const TRUST_REGISTRY_FORMAT = "acestudio.workflowext.trust-registry";
export const REVOCATION_LIST_FORMAT = "acestudio.workflowext.revocation-list";
export const ROOT_REVOCATION_FORMAT = "acestudio.workflowext.root-revocation";

/** All timestamps on the wire are Unix time in seconds, UTC. */
export type UnixSeconds = number;

export interface SignatureBlockPayload {
  format: typeof SIGNATURE_BLOCK_FORMAT;
  formatVersion: 1;
  extensionId: string;
  developerId: string;
  /** SemVer 2.0.0. */
  version: string;
  /** Server-clock signing time — the signer is the timestamp authority. */
  signedAt: UnixSeconds;
  /** Archive path -> lowercase-hex SHA-256; exact two-way coverage. */
  files: Record<string, string>;
}

export interface KeyDirectoryPayload {
  format: typeof KEY_DIRECTORY_FORMAT;
  formatVersion: 1;
  sequence: number;
  issuedAt: UnixSeconds;
  signedBy: string;
  /** Root-signed certificate statements of currently-valid intermediates. */
  intermediates: SignedEnvelope[];
  revokedIntermediates: Array<{ keyId: string; revokedFrom: UnixSeconds }>;
  /** Root-revocation statements travel with the directory (ADR 0089 §2). */
  rootRevocations: SignedEnvelope[];
}

export type TrustTier = "official" | "verified-partner";

export interface TrustRegistryPayload {
  format: typeof TRUST_REGISTRY_FORMAT;
  formatVersion: 1;
  sequence: number;
  issuedAt: UnixSeconds;
  signedBy: string;
  entries: Record<string, { displayName: string; tier: TrustTier }>;
}

export type RevocationReason = "malicious" | "compromised" | "trust-withdrawn" | "developer-request";

export type RevocationEntry =
  | {
      scope: "extension";
      extensionId: string;
      revokedFrom: UnixSeconds;
      reason: RevocationReason;
      note?: string;
    }
  | {
      scope: "extension-version-range";
      extensionId: string;
      /** Inclusive SemVer bounds; an absent bound is unbounded on that side. */
      versionRange: { min?: string; max?: string };
      revokedFrom: UnixSeconds;
      reason: RevocationReason;
      note?: string;
    }
  | {
      scope: "developer";
      developerId: string;
      revokedFrom: UnixSeconds;
      reason: RevocationReason;
      note?: string;
    };

export interface RevocationListPayload {
  format: typeof REVOCATION_LIST_FORMAT;
  formatVersion: 1;
  sequence: number;
  issuedAt: UnixSeconds;
  signedBy: string;
  entries: RevocationEntry[];
}

export interface RootRevocationPayload {
  format: typeof ROOT_REVOCATION_FORMAT;
  formatVersion: 1;
  revokedKeyId: string;
  /** Audit-trail only — clients apply root revocation totally, ignoring time. */
  revokedFrom: UnixSeconds;
  reason: string;
  signedBy: string;
}
