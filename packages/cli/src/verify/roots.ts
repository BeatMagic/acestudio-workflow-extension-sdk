import { readFile } from "node:fs/promises";
import type { TrustedRoot } from "@timedomain/workflowext-verifier";
import productionRoots from "../../roots/production.json" with { type: "json" };

export class RootsError extends Error {}

const ED25519_PUBLIC_KEY_BYTES = 32;

/**
 * Validates a decoded roots value into `TrustedRoot[]`: `[{ keyId, publicKey }]`,
 * where `publicKey` is base64 of the raw 32-byte Ed25519 key — the same shape the
 * service reads from `ROOT_PUBLIC_KEYS` and the golden vectors record. Roots are
 * the trust anchor, so an empty set is a hard error rather than a bundle that
 * trivially fails to verify: nothing is trusted until a root is present. `source`
 * names where the value came from, for error messages.
 */
export function parseRoots(value: unknown, source: string): TrustedRoot[] {
  if (!Array.isArray(value)) {
    throw new RootsError(`trusted roots ${source} must be a JSON array of { keyId, publicKey }`);
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
      `no trusted roots ${source}; embed the production root public key or pass --roots`,
    );
  }
  return roots;
}

/**
 * The root public keys embedded in this build — the default trust anchor. The
 * JSON is inlined at build time so the bundled CLI is self-contained and needs
 * no data file alongside it; `--roots` (see {@link loadRoots}) overrides it.
 */
export function defaultRoots(): TrustedRoot[] {
  return parseRoots(productionRoots, "embedded in this build");
}

/** Loads trusted roots from a JSON file on disk — the `--roots` override. */
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
  return parseRoots(value, `at ${path}`);
}
