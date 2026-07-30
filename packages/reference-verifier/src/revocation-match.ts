import type { RevocationEntry } from "@timedomain/workflowext-wire-schemas";

/**
 * Revocation matching (ADR 0089 §3-4): which entries of a verified
 * revocation list apply to a given signed bundle. An entry blocks bundles
 * whose signedAt is strictly after its revokedFrom — earlier signatures stay
 * valid, preserving pre-incident work; the server is the timestamp
 * authority, so both timestamps are its. What a match *means* (hard-disable
 * vs re-consent) is the caller's read of the entry's reason.
 */

/** The bundle-side facts a revocation entry is matched against. */
export interface RevocationQuery {
  extensionId: string;
  developerId: string;
  /** SemVer 2.0.0, as in the signature block. */
  version: string;
  signedAt: number;
}

/** Every entry applying to the bundle, in list order; empty means unrevoked. */
export function findRevocationMatches(entries: RevocationEntry[], query: RevocationQuery): RevocationEntry[] {
  return entries.filter((entry) => query.signedAt > entry.revokedFrom && scopeMatches(entry, query));
}

function scopeMatches(entry: RevocationEntry, query: RevocationQuery): boolean {
  switch (entry.scope) {
    case "extension":
      return entry.extensionId === query.extensionId;
    case "extension-version-range":
      return (
        entry.extensionId === query.extensionId &&
        (entry.versionRange.min === undefined || compareSemver(query.version, entry.versionRange.min) >= 0) &&
        (entry.versionRange.max === undefined || compareSemver(query.version, entry.versionRange.max) <= 0)
      );
    case "developer":
      return entry.developerId === query.developerId;
    default: {
      // A scope added to the schema must be handled above, not fall through
      // here: an unmatched entry reads as "not revoked", so silence would let
      // a bundle the publisher meant to block keep running. `never` makes that
      // omission a compile error — `strict` alone does not (no
      // `noImplicitReturns`), so an exhaustive switch is not self-guarding.
      const unhandled: never = entry;
      void unhandled;
      return false;
    }
  }
}

/**
 * SemVer 2.0.0 precedence (spec §11), the version-range ordering pinned by
 * the revocation-list schema. Build metadata is ignored; a pre-release ranks
 * below its release. Callers pass schema-validated versions — this does not
 * re-validate.
 */
export function compareSemver(a: string, b: string): -1 | 0 | 1 {
  const [coreA, prereleaseA] = splitSemver(a);
  const [coreB, prereleaseB] = splitSemver(b);

  for (let i = 0; i < 3; i += 1) {
    if (coreA[i]! !== coreB[i]!) return coreA[i]! < coreB[i]! ? -1 : 1;
  }
  if (prereleaseA === null && prereleaseB === null) return 0;
  if (prereleaseA === null) return 1;
  if (prereleaseB === null) return -1;

  const idsA = prereleaseA.split(".");
  const idsB = prereleaseB.split(".");
  for (let i = 0; i < Math.min(idsA.length, idsB.length); i += 1) {
    const cmp = comparePrereleaseIdentifier(idsA[i]!, idsB[i]!);
    if (cmp !== 0) return cmp;
  }
  // All shared identifiers equal: the larger set has higher precedence.
  return idsA.length === idsB.length ? 0 : idsA.length < idsB.length ? -1 : 1;
}

function splitSemver(version: string): [[number, number, number], string | null] {
  const withoutBuild = version.split("+", 1)[0]!;
  const dash = withoutBuild.indexOf("-");
  const core = dash === -1 ? withoutBuild : withoutBuild.slice(0, dash);
  const prerelease = dash === -1 ? null : withoutBuild.slice(dash + 1);
  const [major, minor, patch] = core.split(".").map(Number);
  return [[major!, minor!, patch!], prerelease];
}

const NUMERIC_IDENTIFIER = /^\d+$/;

function comparePrereleaseIdentifier(a: string, b: string): -1 | 0 | 1 {
  const numericA = NUMERIC_IDENTIFIER.test(a);
  const numericB = NUMERIC_IDENTIFIER.test(b);
  // Numeric identifiers compare numerically and always below alphanumeric.
  if (numericA && numericB) {
    const valueA = Number(a);
    const valueB = Number(b);
    return valueA === valueB ? 0 : valueA < valueB ? -1 : 1;
  }
  if (numericA !== numericB) return numericA ? -1 : 1;
  return a === b ? 0 : a < b ? -1 : 1;
}
