import {
  fromBase64,
  isUnixSeconds,
  parseEnvelope,
  utf8Decode,
  verifyEnvelope,
} from "@timedomain/workflowext-signed-json";
import {
  KEY_DIRECTORY_FORMAT,
  ROOT_REVOCATION_FORMAT,
  type KeyDirectoryPayload,
  type RootRevocationPayload,
} from "@timedomain/workflowext-wire-schemas";
import type { TrustedRoot } from "./verdict.js";

/**
 * Client policy for the two root-signed files (ADR 0089 §2-3): a key
 * directory or root-revocation statement is accepted only when its envelope
 * verifies under an embedded root public key, and its payload is parsed only
 * after that signature check. Both are root-signed directly, so an envelope
 * carrying a chain is malformed by construction.
 */

/** Mirrors the wire schemas' keyId rule (a drift-guard test asserts this). */
export const KEY_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export type TrustFileRejectReason =
  | "malformed-envelope"
  | "untrusted-signer"
  | "signer-mismatch"
  | "invalid-payload";

export type KeyDirectoryVerdict =
  | { ok: true; payload: KeyDirectoryPayload; root: TrustedRoot }
  | { ok: false; reason: TrustFileRejectReason };

export type RootRevocationVerdict =
  | { ok: true; payload: RootRevocationPayload; root: TrustedRoot }
  | { ok: false; reason: TrustFileRejectReason };

export async function verifyKeyDirectory(
  bytes: Uint8Array,
  trustedRoots: TrustedRoot[],
): Promise<KeyDirectoryVerdict> {
  return verifyTrustFile(bytes, trustedRoots, parseKeyDirectoryPayload);
}

export async function verifyRootRevocation(
  bytes: Uint8Array,
  trustedRoots: TrustedRoot[],
): Promise<RootRevocationVerdict> {
  return verifyTrustFile(bytes, trustedRoots, parseRootRevocationPayload);
}

async function verifyTrustFile<Payload extends { signedBy: string }>(
  bytes: Uint8Array,
  trustedRoots: TrustedRoot[],
  parsePayload: (value: unknown) => Payload | null,
): Promise<{ ok: true; payload: Payload; root: TrustedRoot } | { ok: false; reason: TrustFileRejectReason }> {
  const envelope = parseEnvelope(bytes);
  if (envelope === null || envelope.chain !== undefined) {
    return { ok: false, reason: "malformed-envelope" };
  }
  for (const root of trustedRoots) {
    const verdict = await verifyEnvelope(root.publicKey, envelope);
    if (!verdict.ok) continue;

    let value: unknown;
    try {
      value = JSON.parse(utf8Decode(verdict.payloadBytes));
    } catch {
      return { ok: false, reason: "invalid-payload" };
    }
    const payload = parsePayload(value);
    if (payload === null) return { ok: false, reason: "invalid-payload" };
    // The signature already proves who signed; a signedBy naming a different
    // key can only mean a broken producer, and clients must not paper over it.
    if (payload.signedBy !== root.keyId) return { ok: false, reason: "signer-mismatch" };
    return { ok: true, payload, root };
  }
  return { ok: false, reason: "untrusted-signer" };
}

// Structural checks mirror the wire schemas the same way payload.ts mirrors
// the signature-block schema — hand-rolled here, cross-checked against the
// schemas by the trust-files test.

/** Package-internal: every required key present, nothing beyond required + optional. */
export function hasExactKeys(
  candidate: Record<string, unknown>,
  required: string[],
  optional: string[] = [],
): boolean {
  const present = Object.keys(candidate);
  return (
    required.every((key) => present.includes(key)) &&
    present.every((key) => required.includes(key) || optional.includes(key))
  );
}

function isEnvelopeItem(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (!hasExactKeys(candidate, ["payload", "signature"])) return false;
  if (typeof candidate.payload !== "string" || typeof candidate.signature !== "string") return false;
  try {
    fromBase64(candidate.payload);
    return fromBase64(candidate.signature).length === 64;
  } catch {
    return false;
  }
}

function parseKeyDirectoryPayload(value: unknown): KeyDirectoryPayload | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  const knownKeys = [
    "format",
    "formatVersion",
    "sequence",
    "issuedAt",
    "signedBy",
    "intermediates",
    "revokedIntermediates",
    "rootRevocations",
  ];
  if (!hasExactKeys(candidate, knownKeys)) return null;
  if (candidate.format !== KEY_DIRECTORY_FORMAT) return null;
  if (candidate.formatVersion !== 1) return null;
  if (typeof candidate.sequence !== "number" || !Number.isInteger(candidate.sequence) || candidate.sequence < 1) return null;
  if (!isUnixSeconds(candidate.issuedAt)) return null;
  if (typeof candidate.signedBy !== "string" || !KEY_ID_PATTERN.test(candidate.signedBy)) return null;
  if (!Array.isArray(candidate.intermediates) || !candidate.intermediates.every(isEnvelopeItem)) return null;
  if (!Array.isArray(candidate.revokedIntermediates)) return null;
  for (const entry of candidate.revokedIntermediates) {
    if (typeof entry !== "object" || entry === null) return null;
    const revoked = entry as Record<string, unknown>;
    if (!hasExactKeys(revoked, ["keyId", "revokedFrom"])) return null;
    if (typeof revoked.keyId !== "string" || !KEY_ID_PATTERN.test(revoked.keyId)) return null;
    if (!isUnixSeconds(revoked.revokedFrom)) return null;
  }
  if (!Array.isArray(candidate.rootRevocations) || !candidate.rootRevocations.every(isEnvelopeItem)) return null;
  return candidate as unknown as KeyDirectoryPayload;
}

function parseRootRevocationPayload(value: unknown): RootRevocationPayload | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  const knownKeys = ["format", "formatVersion", "revokedKeyId", "revokedFrom", "reason", "signedBy"];
  if (!hasExactKeys(candidate, knownKeys)) return null;
  if (candidate.format !== ROOT_REVOCATION_FORMAT) return null;
  if (candidate.formatVersion !== 1) return null;
  if (typeof candidate.revokedKeyId !== "string" || !KEY_ID_PATTERN.test(candidate.revokedKeyId)) return null;
  if (!isUnixSeconds(candidate.revokedFrom)) return null;
  if (typeof candidate.reason !== "string" || candidate.reason.length < 1 || candidate.reason.length > 1024) return null;
  if (typeof candidate.signedBy !== "string" || !KEY_ID_PATTERN.test(candidate.signedBy)) return null;
  return candidate as unknown as RootRevocationPayload;
}
