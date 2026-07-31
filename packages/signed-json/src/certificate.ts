import { fromBase64, toBase64, utf8Decode, utf8Encode } from "./bytes.js";
import { createSignedEnvelope, type SignedEnvelope } from "./envelope.js";

// Every signed payload carries a format discriminator so a signature over one
// statement type can never be replayed as another (domain separation).
export const CERTIFICATE_FORMAT = "acestudio.workflowext.certificate";

export type KeyRole = "root" | "intermediate";

export interface CertificatePayload {
  format: typeof CERTIFICATE_FORMAT;
  formatVersion: 1;
  keyId: string;
  /** base64 of the raw 32-byte Ed25519 public key being certified. */
  publicKey: string;
  role: KeyRole;
  /** Unix time in seconds (UTC). */
  validFrom: number;
  /** keyId of the signing key. */
  signedBy: string;
}

export interface CertificateFields {
  keyId: string;
  publicKey: Uint8Array;
  role: KeyRole;
  validFrom: number;
  signedBy: string;
}

export async function createCertificate(
  signerPrivateKey: CryptoKey,
  fields: CertificateFields,
): Promise<SignedEnvelope> {
  const payload: CertificatePayload = {
    format: CERTIFICATE_FORMAT,
    formatVersion: 1,
    keyId: fields.keyId,
    publicKey: toBase64(fields.publicKey),
    role: fields.role,
    validFrom: fields.validFrom,
    signedBy: fields.signedBy,
  };
  return createSignedEnvelope(signerPrivateKey, utf8Encode(JSON.stringify(payload)));
}

export function isUnixSeconds(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

// The keyId grammar every signed statement shares (mirrors the wire schemas).
const KEY_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

function isKeyId(value: unknown): value is string {
  return typeof value === "string" && KEY_ID_PATTERN.test(value);
}

function isBase64PublicKey(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    return fromBase64(value).length === 32;
  } catch {
    return false;
  }
}

/**
 * Structural validation of verified certificate payload bytes. Call only on
 * bytes whose signature has already been checked (verify-before-parse).
 */
export function parseCertificatePayload(payloadBytes: Uint8Array): CertificatePayload | null {
  let value: unknown;
  try {
    value = JSON.parse(utf8Decode(payloadBytes));
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  const knownKeys = ["format", "formatVersion", "keyId", "publicKey", "role", "validFrom", "signedBy"];
  if (Object.keys(candidate).some((key) => !knownKeys.includes(key))) return null;
  if (candidate.format !== CERTIFICATE_FORMAT) return null;
  if (candidate.formatVersion !== 1) return null;
  if (!isKeyId(candidate.keyId)) return null;
  if (!isBase64PublicKey(candidate.publicKey)) return null;
  if (candidate.role !== "root" && candidate.role !== "intermediate") return null;
  if (!isUnixSeconds(candidate.validFrom)) return null;
  if (!isKeyId(candidate.signedBy)) return null;
  return candidate as unknown as CertificatePayload;
}
