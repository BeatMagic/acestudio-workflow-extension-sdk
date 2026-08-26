import { describe, expect, it } from "vitest";
import { checkDeveloperSlug, developerIdOf, RESERVED_DEVELOPER_SLUGS } from "../src/credentials/developer-id";

describe("checkDeveloperSlug", () => {
  it("accepts the shape the service accepts", () => {
    for (const slug of ["acme", "acme-audio", "a", "a1", "team2026", "a".repeat(64)]) {
      expect(checkDeveloperSlug(slug), slug).toEqual({ ok: true });
    }
  });

  it("refuses shapes the service would refuse", () => {
    for (const slug of ["", "Acme", "acme audio", "-acme", "acme-", "acme.tools", "a".repeat(65), "acme_audio"]) {
      expect(checkDeveloperSlug(slug).ok, slug).toBe(false);
    }
  });

  it("refuses every reserved slug, so the common mistake costs no round trip", () => {
    for (const slug of RESERVED_DEVELOPER_SLUGS) {
      const result = checkDeveloperSlug(slug);
      expect(result.ok, slug).toBe(false);
      if (!result.ok) expect(result.message).toContain("reserved");
    }
  });
});

describe("developerIdOf", () => {
  it("reads the developer segment the service checks a bundle against", () => {
    expect(developerIdOf("acme.stem-tools")).toBe("acme");
    expect(developerIdOf("acme")).toBe("acme");
  });

  it("has no answer for an id with no leading segment", () => {
    expect(developerIdOf("")).toBeNull();
    expect(developerIdOf(".tools")).toBeNull();
  });
});
