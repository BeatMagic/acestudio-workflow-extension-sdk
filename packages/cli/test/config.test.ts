import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadServiceAliases } from "../src/config";
import { resolveService, ServiceUrlError } from "../src/service";

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "aceworkflow-config-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("loadServiceAliases", () => {
  it("reads the services map", async () => {
    await writeFile(join(dir, "config.json"), JSON.stringify({ services: { dev: "https://dev.example" } }));
    expect(await loadServiceAliases(dir)).toEqual({ dev: "https://dev.example" });
  });

  it("returns empty for a missing file", async () => {
    expect(await loadServiceAliases(dir)).toEqual({});
  });

  it("returns empty for a malformed file", async () => {
    await writeFile(join(dir, "config.json"), "{ not json");
    expect(await loadServiceAliases(dir)).toEqual({});
  });

  it("ignores non-string alias values", async () => {
    await writeFile(join(dir, "config.json"), JSON.stringify({ services: { dev: 42, ok: "https://ok.example" } }));
    expect(await loadServiceAliases(dir)).toEqual({ ok: "https://ok.example" });
  });
});

describe("resolveService with aliases", () => {
  it("resolves a named alias to its URL and records the name", () => {
    const resolved = resolveService({ flag: "dev", env: {}, aliases: { dev: "https://dev.example" } });
    expect(resolved.url.origin).toBe("https://dev.example");
    expect(resolved.overridden).toBe(true);
    expect(resolved.alias).toBe("dev");
  });

  it("still accepts a raw URL override with no alias", () => {
    const resolved = resolveService({ flag: "https://raw.example", env: {}, aliases: { dev: "https://dev.example" } });
    expect(resolved.url.origin).toBe("https://raw.example");
    expect(resolved.alias).toBeUndefined();
  });

  it("rejects an unknown name that is neither a URL nor an alias", () => {
    expect(() => resolveService({ flag: "staging", env: {}, aliases: {} })).toThrow(ServiceUrlError);
  });

  it("trims surrounding whitespace from the override before resolving", () => {
    const resolved = resolveService({ flag: "  https://dev.example  ", env: {}, aliases: {} });
    expect(resolved.url.origin).toBe("https://dev.example");
    expect(resolved.overridden).toBe(true);
  });

  it("treats a whitespace-only override as no override (production)", () => {
    const resolved = resolveService({ flag: "   ", env: {}, aliases: {} });
    expect(resolved.overridden).toBe(false);
  });
});
