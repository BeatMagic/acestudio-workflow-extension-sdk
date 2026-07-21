import { isUnixSeconds, utf8Decode } from "@timedomain/workflowext-signed-json";
import {
  SIGNATURE_BLOCK_FORMAT,
  type SignatureBlockPayload,
} from "@timedomain/workflowext-wire-schemas";

// Mirrors signature-block.v1.schema.json — the verifier hand-rolls the checks
// the C++ client will also hand-roll; a test cross-checks them against the
// schema so the two cannot drift.
const SLUG = "[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
export const EXTENSION_ID_PATTERN = new RegExp(`^${SLUG}\\.${SLUG}$`);
export const DEVELOPER_SLUG_PATTERN = new RegExp(`^${SLUG}$`);
export const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const SHA256_HEX_PATTERN = /^[0-9a-f]{64}$/;

/** One dot, two slugs, 129 chars — matches signature-block.v1.schema.json. */
export function isValidExtensionId(id: string): boolean {
  return id.length <= 129 && EXTENSION_ID_PATTERN.test(id);
}

export function isValidDeveloperSlug(slug: string): boolean {
  return slug.length <= 64 && DEVELOPER_SLUG_PATTERN.test(slug);
}

export function isValidSemver(version: string): boolean {
  return version.length <= 256 && SEMVER_PATTERN.test(version);
}

export function isValidArchivePath(path: string): boolean {
  if (path.length === 0 || path.length > 1024) return false;
  if (path.startsWith("/") || path.endsWith("/")) return false;
  if (path.includes("\\") || path.includes("//")) return false;
  if (/(^|\/)\.\.?(\/|$)/.test(path)) return false;
  if (/^_signature(\/|$)/.test(path)) return false;
  return true;
}

/**
 * Structural validation of verified signature-block payload bytes. Call only
 * on bytes whose signature has already been checked (verify-before-parse).
 */
export function parseSignatureBlockPayload(payloadBytes: Uint8Array): SignatureBlockPayload | null {
  let value: unknown;
  try {
    value = JSON.parse(utf8Decode(payloadBytes));
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  const knownKeys = ["format", "formatVersion", "extensionId", "developerId", "version", "signedAt", "files"];
  if (Object.keys(candidate).some((key) => !knownKeys.includes(key))) return null;
  if (candidate.format !== SIGNATURE_BLOCK_FORMAT) return null;
  if (candidate.formatVersion !== 1) return null;
  if (typeof candidate.extensionId !== "string" || !isValidExtensionId(candidate.extensionId)) return null;
  if (typeof candidate.developerId !== "string" || !isValidDeveloperSlug(candidate.developerId)) return null;
  if (typeof candidate.version !== "string" || !isValidSemver(candidate.version)) return null;
  if (!isUnixSeconds(candidate.signedAt)) return null;

  const files = candidate.files;
  if (typeof files !== "object" || files === null || Array.isArray(files)) return null;
  const entries = Object.entries(files as Record<string, unknown>);
  if (entries.length === 0) return null;
  for (const [path, digest] of entries) {
    if (!isValidArchivePath(path)) return null;
    if (typeof digest !== "string" || !SHA256_HEX_PATTERN.test(digest)) return null;
  }
  return candidate as unknown as SignatureBlockPayload;
}
