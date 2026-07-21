import {
  fromBase64,
  isUnixSeconds,
  parseEnvelope,
  utf8Decode,
  verifyEnvelope,
  type CertificatePayload,
} from "@timedomain/workflowext-signed-json";
import {
  REVOCATION_LIST_FORMAT,
  TRUST_REGISTRY_FORMAT,
  type RevocationEntry,
  type RevocationListPayload,
  type TrustRegistryPayload,
} from "@timedomain/workflowext-wire-schemas";
import { resolveChain } from "./chain";
import { DEVELOPER_SLUG_PATTERN, EXTENSION_ID_PATTERN, SEMVER_PATTERN } from "./payload";
import { hasExactKeys, KEY_ID_PATTERN } from "./trust-files";
import type { TrustedRoot } from "./verdict";

/**
 * Client policy for the two intermediate-signed served files (ADR 0089 §3-4):
 * the trust registry and revocation list are accepted only when their chain
 * resolves to an embedded root, the envelope verifies under the certified
 * intermediate key, and the payload — parsed only after that signature check —
 * is structurally exact. The sequence ratchet itself is the caller's: clients
 * persist the last-accepted sequence and refuse older files.
 */

export type ChainedTrustFileRejectReason =
  | "malformed-envelope"
  | "bad-chain"
  | "bad-signature"
  | "invalid-payload"
  | "signer-mismatch"
  | "signer-not-yet-valid";

export type TrustRegistryVerdict =
  | { ok: true; payload: TrustRegistryPayload; certificate: CertificatePayload; root: TrustedRoot }
  | { ok: false; reason: ChainedTrustFileRejectReason; detail?: string };

export type RevocationListVerdict =
  | { ok: true; payload: RevocationListPayload; certificate: CertificatePayload; root: TrustedRoot }
  | { ok: false; reason: ChainedTrustFileRejectReason; detail?: string };

export async function verifyTrustRegistry(
  bytes: Uint8Array,
  trustedRoots: TrustedRoot[],
): Promise<TrustRegistryVerdict> {
  return verifyChainedTrustFile(bytes, trustedRoots, parseTrustRegistryPayload);
}

export async function verifyRevocationList(
  bytes: Uint8Array,
  trustedRoots: TrustedRoot[],
): Promise<RevocationListVerdict> {
  return verifyChainedTrustFile(bytes, trustedRoots, parseRevocationListPayload);
}

async function verifyChainedTrustFile<Payload extends { signedBy: string; issuedAt: number }>(
  bytes: Uint8Array,
  trustedRoots: TrustedRoot[],
  parsePayload: (payloadBytes: Uint8Array) => Payload | null,
): Promise<
  | { ok: true; payload: Payload; certificate: CertificatePayload; root: TrustedRoot }
  | { ok: false; reason: ChainedTrustFileRejectReason; detail?: string }
> {
  const envelope = parseEnvelope(bytes);
  if (envelope === null) {
    return { ok: false, reason: "malformed-envelope" };
  }

  const chain = await resolveChain(envelope.chain, trustedRoots);
  if (!chain.ok) {
    return { ok: false, reason: "bad-chain", detail: chain.detail };
  }

  const verified = await verifyEnvelope(fromBase64(chain.certificate.publicKey), envelope);
  if (!verified.ok) {
    return {
      ok: false,
      reason: verified.reason === "bad-signature" ? "bad-signature" : "malformed-envelope",
    };
  }

  const payload = parsePayload(verified.payloadBytes);
  if (payload === null) {
    return { ok: false, reason: "invalid-payload" };
  }
  // The signature already proves who signed; a signedBy naming a different
  // key can only mean a broken producer, and clients must not paper over it.
  if (payload.signedBy !== chain.certificate.keyId) {
    return { ok: false, reason: "signer-mismatch" };
  }
  if (payload.issuedAt < chain.certificate.validFrom) {
    return { ok: false, reason: "signer-not-yet-valid" };
  }
  return { ok: true, payload, certificate: chain.certificate, root: chain.root };
}

// Structural checks mirror the wire schemas — hand-rolled the same way
// payload.ts mirrors the signature-block schema, cross-checked against the
// schemas by the chained-trust-files test.

function parseServedFileCommon(
  payloadBytes: Uint8Array,
  format: string,
): Record<string, unknown> | null {
  let value: unknown;
  try {
    value = JSON.parse(utf8Decode(payloadBytes));
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (!hasExactKeys(candidate, ["format", "formatVersion", "sequence", "issuedAt", "signedBy", "entries"])) return null;
  if (candidate.format !== format) return null;
  if (candidate.formatVersion !== 1) return null;
  if (typeof candidate.sequence !== "number" || !Number.isInteger(candidate.sequence) || candidate.sequence < 1) return null;
  if (!isUnixSeconds(candidate.issuedAt)) return null;
  if (typeof candidate.signedBy !== "string" || !KEY_ID_PATTERN.test(candidate.signedBy)) return null;
  return candidate;
}

function isDeveloperSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 64 && DEVELOPER_SLUG_PATTERN.test(value);
}

export function parseTrustRegistryPayload(payloadBytes: Uint8Array): TrustRegistryPayload | null {
  const candidate = parseServedFileCommon(payloadBytes, TRUST_REGISTRY_FORMAT);
  if (candidate === null) return null;

  const entries = candidate.entries;
  if (typeof entries !== "object" || entries === null || Array.isArray(entries)) return null;
  for (const [developerId, entry] of Object.entries(entries as Record<string, unknown>)) {
    if (!isDeveloperSlug(developerId)) return null;
    if (typeof entry !== "object" || entry === null) return null;
    const record = entry as Record<string, unknown>;
    if (!hasExactKeys(record, ["displayName", "tier"])) return null;
    if (typeof record.displayName !== "string" || record.displayName.length < 1 || record.displayName.length > 128) return null;
    if (record.tier !== "official" && record.tier !== "verified-partner") return null;
  }
  return candidate as unknown as TrustRegistryPayload;
}

export function parseRevocationListPayload(payloadBytes: Uint8Array): RevocationListPayload | null {
  const candidate = parseServedFileCommon(payloadBytes, REVOCATION_LIST_FORMAT);
  if (candidate === null) return null;

  if (!Array.isArray(candidate.entries)) return null;
  if (!candidate.entries.every(isRevocationEntry)) return null;
  return candidate as unknown as RevocationListPayload;
}

function isRevocationEntry(value: unknown): value is RevocationEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;

  if (!isUnixSeconds(entry.revokedFrom)) return false;
  const reasons = ["malicious", "compromised", "trust-withdrawn", "developer-request"];
  if (typeof entry.reason !== "string" || !reasons.includes(entry.reason)) return false;
  if (entry.note !== undefined && (typeof entry.note !== "string" || entry.note.length > 1024)) return false;

  switch (entry.scope) {
    case "extension":
      if (!hasExactKeys(entry, ["scope", "extensionId", "revokedFrom", "reason"], ["note"])) return false;
      return isExtensionId(entry.extensionId);
    case "extension-version-range":
      if (!hasExactKeys(entry, ["scope", "extensionId", "versionRange", "revokedFrom", "reason"], ["note"])) return false;
      return isExtensionId(entry.extensionId) && isVersionRange(entry.versionRange);
    case "developer":
      if (!hasExactKeys(entry, ["scope", "developerId", "revokedFrom", "reason"], ["note"])) return false;
      return isDeveloperSlug(entry.developerId);
    default:
      return false;
  }
}

function isExtensionId(value: unknown): value is string {
  return typeof value === "string" && value.length <= 129 && EXTENSION_ID_PATTERN.test(value);
}

function isVersionRange(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const range = value as Record<string, unknown>;
  const keys = Object.keys(range);
  if (keys.length === 0 || keys.some((key) => key !== "min" && key !== "max")) return false;
  return keys.every((key) => {
    const bound = range[key];
    return typeof bound === "string" && bound.length <= 256 && SEMVER_PATTERN.test(bound);
  });
}
