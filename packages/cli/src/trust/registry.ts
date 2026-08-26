import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { verifyTrustRegistry } from "@timedomain/workflowext-verifier";
import type { TrustedRoot } from "@timedomain/workflowext-verifier";
import type { TrustTier } from "@timedomain/workflowext-wire-schemas";
import { appDataDir } from "../credentials/store";

/**
 * What this client knows about a developer id. Registered identities are
 * granted in the web portal, so the authority is entirely server-side and a
 * client's picture of it is a cache that goes stale the moment someone is
 * granted an identity elsewhere — which is why "unknown" is a distinct answer
 * from "not registered", and why a miss is worth one round trip.
 */
export type DeveloperStanding =
  | { known: true; registered: true; tier: TrustTier; displayName: string }
  | { known: true; registered: false }
  /** The registry could not be fetched or did not verify — decide without it. */
  | { known: false };

interface CachedRegistry {
  /** The sequence the cached entries came from. Never allowed to go backwards. */
  sequence: number;
  entries: Record<string, { displayName: string; tier: TrustTier }>;
}

interface CacheFile {
  version: 1;
  services: Record<string, CachedRegistry>;
}

export function registryCachePath(dir: string = appDataDir()): string {
  return join(dir, "trust-registry.json");
}

async function readCache(path: string): Promise<CacheFile> {
  try {
    const value = JSON.parse(await readFile(path, "utf-8")) as Partial<CacheFile>;
    if (value.services !== null && typeof value.services === "object" && !Array.isArray(value.services)) {
      return { version: 1, services: value.services as CacheFile["services"] };
    }
  } catch {
    // Missing or corrupt reads as empty; the next fetch rewrites it.
  }
  return { version: 1, services: {} };
}

async function writeCache(dir: string, path: string, file: CacheFile): Promise<void> {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await writeFile(path, `${JSON.stringify(file, null, 2)}\n`, { mode: 0o600 });
}

/** Injected so the lookup is testable without a network or a real app-data dir. */
export interface RegistryDeps {
  roots: TrustedRoot[];
  dir?: string;
  fetchBytes?: (service: URL) => Promise<Uint8Array>;
}

async function fetchRegistry(service: URL): Promise<Uint8Array> {
  const response = await fetch(new URL("trust/trust-registry.json", service).toString());
  if (!response.ok) throw new Error(`trust registry responded ${String(response.status)}`);
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * What the service says about a developer id, answered from a local cache and
 * refreshed when that cache has never seen the id in question.
 *
 * The refresh condition is the point: a slug missing from the cache is exactly
 * the case a stale cache cannot distinguish from a slug that was granted after
 * the cache was written, so a miss re-reads rather than concluding. A hit costs
 * nothing, and neither does a second miss on the same fetched sequence.
 *
 * Everything here is advisory. The registry is public and unauthenticated by
 * design (it is the data a client needs *before* it can trust anything), so a
 * fetch that fails or a file that does not verify answers "unknown" and leaves
 * the decision to the service, which re-checks all of it anyway.
 */
export async function lookupDeveloper(
  service: URL,
  developerId: string,
  deps: RegistryDeps,
): Promise<DeveloperStanding> {
  const dir = deps.dir ?? appDataDir();
  const path = registryCachePath(dir);
  const origin = service.origin;

  const file = await readCache(path);
  const cached = file.services[origin];
  const hit = cached?.entries[developerId];
  if (hit !== undefined) {
    return { known: true, registered: true, tier: hit.tier, displayName: hit.displayName };
  }

  let bytes: Uint8Array;
  try {
    bytes = await (deps.fetchBytes ?? fetchRegistry)(service);
  } catch {
    // No network, or a service that does not serve one. The cached answer, if
    // there is one, is better than nothing; otherwise this is simply unknown.
    return cached !== undefined ? { known: true, registered: false } : { known: false };
  }

  const verdict = await verifyTrustRegistry(bytes, deps.roots);
  if (!verdict.ok) return { known: false };

  // The sequence ratchet is the client's to keep (ADR 0089 §3-4): a file older
  // than one already accepted is a rollback, and answering from it would undo
  // a grant this machine has already seen.
  if (cached !== undefined && verdict.payload.sequence < cached.sequence) {
    const stale = cached.entries[developerId];
    return stale !== undefined
      ? { known: true, registered: true, tier: stale.tier, displayName: stale.displayName }
      : { known: true, registered: false };
  }

  file.services[origin] = { sequence: verdict.payload.sequence, entries: verdict.payload.entries };
  try {
    await writeCache(dir, path, file);
  } catch {
    // An unwritable cache costs a fetch next time, nothing more.
  }

  const fresh = verdict.payload.entries[developerId];
  return fresh !== undefined
    ? { known: true, registered: true, tier: fresh.tier, displayName: fresh.displayName }
    : { known: true, registered: false };
}
