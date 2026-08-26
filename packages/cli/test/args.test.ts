import { describe, expect, it } from "vitest";
import { parseArgs, UsageError } from "../src/args";
import { resolveService, ServiceUrlError, PRODUCTION_SERVICE } from "../src/service";
import { ExitCode, exitForServiceCode } from "../src/exit-codes";

describe("parseArgs", () => {
  it("reads a command, positionals, valued and boolean flags", () => {
    const parsed = parseArgs(["sign", "./ext", "--service", "https://svc.example", "-o", "out.zip", "--json", "-y"]);
    expect(parsed.command).toBe("sign");
    expect(parsed.positionals).toEqual(["./ext"]);
    expect(parsed.options.service).toBe("https://svc.example");
    expect(parsed.options.out).toBe("out.zip");
    expect(parsed.options.json).toBe(true);
    expect(parsed.options.yes).toBe(true);
  });

  it("accepts --flag=value form", () => {
    expect(parseArgs(["submit", "b.zip", "--service=https://x.example"]).options.service).toBe("https://x.example");
  });

  it("treats --no-verify and --ad-hoc as booleans", () => {
    const parsed = parseArgs(["sign", "./ext", "--no-verify", "--ad-hoc"]);
    expect(parsed.options.noVerify).toBe(true);
    expect(parsed.options.adHoc).toBe(true);
  });

  it("rejects an unknown option", () => {
    expect(() => parseArgs(["sign", "--nope"])).toThrow(UsageError);
  });

  it("rejects a valued flag with no value", () => {
    expect(() => parseArgs(["sign", "./ext", "--service"])).toThrow(UsageError);
  });

  it("rejects a value on a boolean flag", () => {
    expect(() => parseArgs(["sign", "--json=1"])).toThrow(UsageError);
  });

  it("stops option parsing at --", () => {
    const parsed = parseArgs(["pack", "--", "--weird-dir-name"]);
    expect(parsed.positionals).toEqual(["--weird-dir-name"]);
  });
});

describe("resolveService", () => {
  it("defaults to production, not flagged as overridden", () => {
    const resolved = resolveService({ env: {} });
    expect(resolved.url.origin).toBe(new URL(PRODUCTION_SERVICE).origin);
    expect(resolved.overridden).toBe(false);
  });

  it("honours --service and marks it overridden", () => {
    const resolved = resolveService({ flag: "https://dev.example", env: {} });
    expect(resolved.url.origin).toBe("https://dev.example");
    expect(resolved.overridden).toBe(true);
  });

  it("honours the ACEWORKFLOW_SERVICE env var", () => {
    const resolved = resolveService({ env: { ACEWORKFLOW_SERVICE: "https://env.example" } });
    expect(resolved.url.origin).toBe("https://env.example");
    expect(resolved.overridden).toBe(true);
  });

  it("resolves endpoints under a base path with a trailing slash", () => {
    const resolved = resolveService({ flag: "https://host.example/api", env: {} });
    expect(new URL("submissions", resolved.url).toString()).toBe("https://host.example/api/submissions");
  });

  it("rejects a malformed URL", () => {
    expect(() => resolveService({ flag: "not a url", env: {} })).toThrow(ServiceUrlError);
  });
});

describe("exitForServiceCode", () => {
  it("maps known service codes to their stable exits", () => {
    expect(exitForServiceCode("missing-credential")).toBe(ExitCode.MissingCredential);
    expect(exitForServiceCode("identity-refused")).toBe(ExitCode.IdentityRefused);
    expect(exitForServiceCode("rate-limited")).toBe(ExitCode.RateLimited);
    expect(exitForServiceCode("bundle-too-large")).toBe(ExitCode.BundleTooLarge);
    expect(exitForServiceCode("invalid-version")).toBe(ExitCode.ManifestInvalid);
  });

  it("maps every way the service refuses an identity to IdentityRefused", () => {
    // A script branching on the exit code needs "not your identity" to be one
    // answer, however the service phrased the refusal.
    for (const code of [
      "identity-refused",
      "namespace-violation",
      "reserved-slug",
      "elevated-tier-conflict",
      "privilege-not-official",
      "update-continuity",
    ]) {
      expect(exitForServiceCode(code), code).toBe(ExitCode.IdentityRefused);
    }
  });

  it("maps a refused developer-id shape with the other id-validation failures", () => {
    expect(exitForServiceCode("bad-slug")).toBe(ExitCode.ManifestInvalid);
  });

  it("collapses unmapped codes to Generic", () => {
    expect(exitForServiceCode("signing-self-check-failed")).toBe(ExitCode.Generic);
    expect(exitForServiceCode("network-error")).toBe(ExitCode.Generic);
  });
});
