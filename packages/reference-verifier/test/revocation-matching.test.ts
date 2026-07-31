import { describe, expect, it } from "vitest";
import type { RevocationEntry } from "@timedomain/workflowext-wire-schemas";
import { compareSemver, findRevocationMatches, type RevocationQuery } from "../src/index.js";

const QUERY: RevocationQuery = {
  extensionId: "dev.tool",
  developerId: "dev",
  version: "1.2.3",
  signedAt: 1_000,
};

function entry(overrides: Partial<RevocationEntry> & { scope: RevocationEntry["scope"] }): RevocationEntry {
  const base = { revokedFrom: 500, reason: "malicious" as const };
  switch (overrides.scope) {
    case "extension":
      return { ...base, extensionId: "dev.tool", ...overrides } as RevocationEntry;
    case "extension-version-range":
      return { ...base, extensionId: "dev.tool", versionRange: {}, ...overrides } as RevocationEntry;
    case "developer":
      return { ...base, developerId: "dev", ...overrides } as RevocationEntry;
  }
}

describe("compareSemver", () => {
  it("orders the numeric core numerically, not lexically", () => {
    expect(compareSemver("2.0.0", "10.0.0")).toBe(-1);
    expect(compareSemver("1.9.0", "1.10.0")).toBe(-1);
    expect(compareSemver("1.0.10", "1.0.2")).toBe(1);
    expect(compareSemver("1.2.3", "1.2.3")).toBe(0);
  });

  it("ranks any pre-release below its release", () => {
    expect(compareSemver("1.0.0-alpha", "1.0.0")).toBe(-1);
    expect(compareSemver("1.0.0", "1.0.0-rc.1")).toBe(1);
  });

  it("orders pre-release identifiers per SemVer §11", () => {
    // The spec's own chain: alpha < alpha.1 < alpha.beta < beta < beta.2
    // < beta.11 < rc.1 < release.
    const chain = [
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-alpha.beta",
      "1.0.0-beta",
      "1.0.0-beta.2",
      "1.0.0-beta.11",
      "1.0.0-rc.1",
      "1.0.0",
    ];
    for (let i = 1; i < chain.length; i += 1) {
      expect(compareSemver(chain[i - 1]!, chain[i]!), `${chain[i - 1]} < ${chain[i]}`).toBe(-1);
    }
  });

  it("compares numeric identifiers numerically and below alphanumeric ones", () => {
    expect(compareSemver("1.0.0-2", "1.0.0-11")).toBe(-1);
    expect(compareSemver("1.0.0-1", "1.0.0-a")).toBe(-1);
  });

  it("ignores build metadata", () => {
    expect(compareSemver("1.2.3+build.5", "1.2.3+other")).toBe(0);
    expect(compareSemver("1.2.3-rc.1+build", "1.2.3-rc.1")).toBe(0);
  });

  it("keeps precedence exact past Number.MAX_SAFE_INTEGER", () => {
    // Both cores are schema-valid; as doubles they collapse to one value.
    expect(compareSemver("9007199254740993.0.0", "9007199254740992.0.0")).toBe(1);
    expect(compareSemver("1.0.0-9007199254740993", "1.0.0-9007199254740992")).toBe(1);
  });
});

describe("findRevocationMatches", () => {
  it("matches an extension-scoped entry only for that extension id", () => {
    const hit = entry({ scope: "extension" });
    const miss = entry({ scope: "extension", extensionId: "dev.other" });
    expect(findRevocationMatches([miss, hit], QUERY)).toEqual([hit]);
  });

  it("matches a developer-scoped entry for every extension of that developer", () => {
    const hit = entry({ scope: "developer" });
    const miss = entry({ scope: "developer", developerId: "someone-else" });
    expect(findRevocationMatches([miss, hit], QUERY)).toEqual([hit]);
    expect(findRevocationMatches([hit], { ...QUERY, extensionId: "dev.another" })).toEqual([hit]);
  });

  it("blocks only bundles signed strictly after revoked-from", () => {
    const boundary = entry({ scope: "extension", revokedFrom: QUERY.signedAt });
    expect(findRevocationMatches([boundary], QUERY)).toEqual([]);
    expect(findRevocationMatches([boundary], { ...QUERY, signedAt: QUERY.signedAt + 1 })).toEqual([boundary]);
    expect(findRevocationMatches([boundary], { ...QUERY, signedAt: QUERY.signedAt - 1 })).toEqual([]);
  });

  it("treats version-range bounds as inclusive", () => {
    const range = entry({ scope: "extension-version-range", versionRange: { min: "1.0.0", max: "1.2.3" } });
    expect(findRevocationMatches([range], QUERY)).toEqual([range]);
    expect(findRevocationMatches([range], { ...QUERY, version: "1.0.0" })).toEqual([range]);
    expect(findRevocationMatches([range], { ...QUERY, version: "1.2.4" })).toEqual([]);
    expect(findRevocationMatches([range], { ...QUERY, version: "0.9.9" })).toEqual([]);
  });

  it("treats an absent bound as unbounded on that side", () => {
    const minOnly = entry({ scope: "extension-version-range", versionRange: { min: "1.0.0" } });
    const maxOnly = entry({ scope: "extension-version-range", versionRange: { max: "1.0.0" } });
    expect(findRevocationMatches([minOnly], { ...QUERY, version: "999.0.0" })).toEqual([minOnly]);
    expect(findRevocationMatches([maxOnly], { ...QUERY, version: "0.0.1" })).toEqual([maxOnly]);
    expect(findRevocationMatches([maxOnly], QUERY)).toEqual([]);
  });

  it("requires the extension id to match before consulting the range", () => {
    const range = entry({
      scope: "extension-version-range",
      extensionId: "dev.other",
      versionRange: { min: "0.0.1" },
    });
    expect(findRevocationMatches([range], QUERY)).toEqual([]);
  });

  it("compares range bounds by SemVer precedence, so pre-releases sit below their release", () => {
    const range = entry({ scope: "extension-version-range", versionRange: { min: "1.2.3-rc.1", max: "1.2.3-rc.9" } });
    expect(findRevocationMatches([range], { ...QUERY, version: "1.2.3-rc.2" })).toEqual([range]);
    expect(findRevocationMatches([range], { ...QUERY, version: "1.2.3" })).toEqual([]);
  });

  it("returns every matching entry, preserving list order", () => {
    const first = entry({ scope: "developer" });
    const second = entry({ scope: "extension", reason: "compromised" });
    expect(findRevocationMatches([first, second], QUERY)).toEqual([first, second]);
  });
});
