import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { TrustedRoot } from "@beatmagic/workflowext-verifier";

export class RootsError extends Error {}

/** The root public keys this CLI build ships with — the default trust anchor. */
export const DEFAULT_ROOTS_PATH = fileURLToPath(new URL("../../roots/production.json", import.meta.url));

const ED25519_PUBLIC_KEY_BYTES = 32;

/**
 * Loads trusted roots from a JSON file: `[{ keyId, publicKey }]`, where
 * `publicKey` is base64 of the raw 32-byte Ed25519 key — the same shape the
 * service reads from `ROOT_PUBLIC_KEYS` and the golden vectors record. Roots
 * are the trust anchor, so an empty set is a hard error rather than a bundle
 * that trivially fails to verify: nothing is trusted until a root is embedded.
 */
export async function loadRoots(path: string): Promise<TrustedRoot[]> {
  let text: string;
  try {
    text = await readFile(path, "utf-8");
  } catch {
    throw new RootsError(`cannot read trusted roots at ${path}`);
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new RootsError(`trusted roots at ${path} are not valid JSON`);
  }
  if (!Array.isArray(value)) {
    throw new RootsError(`trusted roots at ${path} must be a JSON array of { keyId, publicKey }`);
  }
  const roots: TrustedRoot[] = value.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      throw new RootsError(`trusted root #${index} must be an object`);
    }
    const record = entry as Record<string, unknown>;
    if (typeof record.keyId !== "string" || record.keyId.length === 0) {
      throw new RootsError(`trusted root #${index} is missing a keyId`);
    }
    if (typeof record.publicKey !== "string") {
      throw new RootsError(`trusted root "${record.keyId}" is missing a base64 publicKey`);
    }
    const publicKey = new Uint8Array(Buffer.from(record.publicKey, "base64"));
    if (publicKey.length !== ED25519_PUBLIC_KEY_BYTES) {
      throw new RootsError(
        `trusted root "${record.keyId}" publicKey must be ${ED25519_PUBLIC_KEY_BYTES} raw bytes, base64-encoded`,
      );
    }
    return { keyId: record.keyId, publicKey };
  });
  if (roots.length === 0) {
    throw new RootsError(
      `no trusted roots configured at ${path}; embed the production root public key or pass --roots`,
    );
  }
  return roots;
}
