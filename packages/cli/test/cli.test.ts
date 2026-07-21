import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { run, type RunDeps } from "../src/app";
import { ExitCode } from "../src/exit-codes";
import type { CredentialStore } from "../src/credentials/store";
import { packDir } from "../src/bundle/pack";
import { writeZip } from "../src/bundle/zip";
import { verifyBundleBytes } from "../src/verify/verify";
import { makeTestSigner, rootsOf, rootsFileContent, signFiles, FIXTURE_SIGNED_AT } from "./fixtures";

const SERVICE = "https://svc.example";

class MemoryStore implements CredentialStore {
  readonly map = new Map<string, string>();
  async get(origin: string): Promise<string | null> {
    return this.map.get(origin) ?? null;
  }
  async set(origin: string, bearer: string): Promise<void> {
    this.map.set(origin, bearer);
  }
  async remove(origin: string): Promise<boolean> {
    return this.map.delete(origin);
  }
}

let dir: string;
let out: string[];
let err: string[];
let store: MemoryStore;

function deps(argv: string[], overrides: Partial<RunDeps> = {}): RunDeps {
  return {
    argv,
    env: {},
    cwd: dir,
    out: (t) => out.push(t),
    err: (t) => err.push(t),
    store,
    stdinIsTTY: false,
    stdoutIsTTY: false,
    ...overrides,
  };
}

async function makeExtensionDir(): Promise<string> {
  const ext = join(dir, "ext");
  await mkdir(join(ext, "dist"), { recursive: true });
  await writeFile(join(ext, "manifest.json"), '{"id":"team.demo","version":"1.2.0","displayName":"Demo"}');
  await writeFile(join(ext, "dist", "index.js"), "export const x = 1;\n");
  return ext;
}

async function buildSignedBundle(): Promise<Uint8Array<ArrayBuffer>> {
  const signer = await makeTestSigner();
  const ext = await makeExtensionDir();
  const files = await packDir(ext);
  const signed = await signFiles(signer, files, { extensionId: "team.demo", developerId: "team", version: "1.2.0" });
  await rm(ext, { recursive: true, force: true });
  return writeZip(signed, FIXTURE_SIGNED_AT);
}

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "aceworkflow-cli-"));
  out = [];
  err = [];
  store = new MemoryStore();
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("help and version", () => {
  it("prints help and exits 0", async () => {
    expect(await run(deps(["--help"]))).toBe(ExitCode.Success);
    expect(out.join("")).toContain("aceworkflow");
  });

  it("exits 2 with no command", async () => {
    expect(await run(deps([]))).toBe(ExitCode.Usage);
  });

  it("rejects an unknown command with usage exit", async () => {
    expect(await run(deps(["frobnicate"]))).toBe(ExitCode.Usage);
  });
});

describe("pack", () => {
  it("packs a dir to a manifest-derived name", async () => {
    const ext = await makeExtensionDir();
    const code = await run(deps(["pack", ext]));
    expect(code).toBe(ExitCode.Success);
    expect(existsSync(join(dir, "demo-1.2.0.aceworkflow"))).toBe(true);
  });

  it("resolves a relative input path against the injected cwd", async () => {
    await makeExtensionDir(); // creates <cwd>/ext
    const code = await run(deps(["pack", "ext"])); // relative; deps() cwd is the temp dir
    expect(code).toBe(ExitCode.Success);
    expect(existsSync(join(dir, "demo-1.2.0.aceworkflow"))).toBe(true);
  });
});

describe("service override banner", () => {
  it("announces an overridden service on stderr", async () => {
    const ext = await makeExtensionDir();
    await run(deps(["pack", ext, "--service", SERVICE]));
    expect(err.join("")).toContain("(overridden)");
  });

  it("says nothing about the backend on the default path", async () => {
    const ext = await makeExtensionDir();
    await run(deps(["pack", ext]));
    expect(err.join("")).not.toContain("overridden");
  });

  it("still warns under --json, and keeps stdout clean", async () => {
    const ext = await makeExtensionDir();
    await run(deps(["pack", ext, "--service", SERVICE, "--json"]));
    expect(err.join("")).toContain("(overridden)");
    expect(out.join("")).not.toContain("overridden");
  });

  it("still warns under --quiet", async () => {
    const ext = await makeExtensionDir();
    await run(deps(["pack", ext, "--service", SERVICE, "--quiet"]));
    expect(err.join("")).toContain("(overridden)");
  });
});

describe("--json on error paths", () => {
  it("emits a JSON error object for an unknown option", async () => {
    const code = await run(deps(["sign", "--bogus", "--json"]));
    expect(code).toBe(ExitCode.Usage);
    const parsed = JSON.parse(out.join("")) as { code: string };
    expect(parsed.code).toBe("usage");
  });

  it("emits a JSON error object when no command is given", async () => {
    const code = await run(deps(["--json"]));
    expect(code).toBe(ExitCode.Usage);
    expect(JSON.parse(out.join("")) as { code: string }).toMatchObject({ code: "usage" });
  });
});

describe("submit credential handling", () => {
  it("exits 3 (missing-credential) with no token and no --ad-hoc", async () => {
    const bundle = join(dir, "b.aceworkflow");
    await writeFile(bundle, "not really a zip");
    const code = await run(deps(["submit", bundle, "--service", SERVICE]));
    expect(code).toBe(ExitCode.MissingCredential);
  });

  it("maps a 429 to exit 5 (rate-limited)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(new Response(JSON.stringify({ error: "slow down", code: "rate-limited" }), { status: 429 })),
      ),
    );
    const bundle = join(dir, "b.aceworkflow");
    await writeFile(bundle, "x");
    const code = await run(deps(["submit", bundle, "--service", SERVICE, "--token", "wxst_test"]));
    expect(code).toBe(ExitCode.RateLimited);
  });

  it("prompts for a token on an interactive TTY when nothing is cached", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(new Uint8Array([1]), {
            status: 200,
            headers: {
              "x-extension-id": "team.demo",
              "x-developer-id": "team",
              "x-version": "1.0.0",
              "x-signed-at": "1752710400",
              "x-bundle-sha256": "abc123",
            },
          }),
        ),
      ),
    );
    const bundle = join(dir, "b.aceworkflow");
    await writeFile(bundle, "x");
    let asked = false;
    const prompter = {
      async line(): Promise<string> {
        asked = true;
        return "wxst_pasted";
      },
      async choice(): Promise<string> {
        return "registered";
      },
    };
    const code = await run(
      deps(["submit", bundle, "--service", SERVICE, "-o", join(dir, "out.aceworkflow")], {
        stdinIsTTY: true,
        stdoutIsTTY: true,
        prompter,
      }),
    );
    expect(asked).toBe(true);
    expect(code).toBe(ExitCode.Success);
    // The pasted token is stored for continuity.
    expect(store.map.get(SERVICE)).toBe("wxst_pasted");
  });
});

describe("sign end-to-end (mocked service)", () => {
  it("packs, submits, self-verifies against --roots, and writes the output", async () => {
    const signer = await makeTestSigner();
    const ext = await makeExtensionDir();
    const files = await packDir(ext);
    const signed = await signFiles(signer, files, {
      extensionId: "team.demo",
      developerId: "team",
      version: "1.2.0",
    });
    const signedBytes = await writeZip(signed, FIXTURE_SIGNED_AT);

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(signedBytes, {
            status: 200,
            headers: {
              "content-type": "application/zip",
              "content-disposition": 'attachment; filename="demo-1.2.0.aceworkflow"',
              "x-extension-id": "team.demo",
              "x-developer-id": "team",
              "x-version": "1.2.0",
              "x-signed-at": String(FIXTURE_SIGNED_AT),
              "x-bundle-sha256": "deadbeef",
            },
          }),
        ),
      ),
    );

    const rootsFile = join(dir, "roots.json");
    await writeFile(rootsFile, rootsFileContent(signer));
    const outPath = join(dir, "dist", "signed.aceworkflow");

    const code = await run(deps(["sign", ext, "--service", SERVICE, "--token", "wxst_test", "--roots", rootsFile, "-o", outPath]));
    expect(code).toBe(ExitCode.Success);
    expect(existsSync(outPath)).toBe(true);

    // The written bytes independently verify against the same root.
    const written = new Uint8Array(await readFile(outPath));
    const verdict = await verifyBundleBytes(written, rootsOf(signer));
    expect(verdict.ok).toBe(true);
    expect(err.join("")).toContain("reference-verifier: ACCEPT");
  });

  it("emits a single JSON result object under --json", async () => {
    const signedBytes = await buildSignedBundle();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(signedBytes, {
            status: 200,
            headers: {
              "x-extension-id": "team.demo",
              "x-developer-id": "team",
              "x-version": "1.2.0",
              "x-signed-at": String(FIXTURE_SIGNED_AT),
              "x-bundle-sha256": "deadbeef",
            },
          }),
        ),
      ),
    );
    const bundle = join(dir, "prebuilt.aceworkflow");
    await writeFile(bundle, Buffer.from(signedBytes));

    const code = await run(
      deps(["sign", bundle, "--service", SERVICE, "--token", "wxst_test", "--no-verify", "--json", "-o", join(dir, "o.aceworkflow")]),
    );
    expect(code).toBe(ExitCode.Success);
    const parsed = JSON.parse(out.join("")) as { command: string; extensionId: string; verified: boolean | null };
    expect(parsed.command).toBe("sign");
    expect(parsed.extensionId).toBe("team.demo");
    expect(parsed.verified).toBeNull();
  });

  it("skips self-verify with a warning when the roots resolve empty", async () => {
    const signedBytes = await buildSignedBundle();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(signedBytes, {
            status: 200,
            headers: {
              "x-extension-id": "team.demo",
              "x-version": "1.2.0",
              "x-developer-id": "team",
              "x-signed-at": "1752710400",
              "x-bundle-sha256": "abc123",
            },
          }),
        ),
      ),
    );
    const ext = await makeExtensionDir();
    const emptyRoots = join(dir, "empty-roots.json");
    await writeFile(emptyRoots, "[]");
    const code = await run(
      deps(["sign", ext, "--service", SERVICE, "--token", "wxst_test", "--roots", emptyRoots, "-o", join(dir, "o.aceworkflow")]),
    );
    expect(code).toBe(ExitCode.Success);
    expect(err.join("")).toContain("self-verify skipped");
  });

  it("self-verify against the default production root rejects a foreign-signed bundle (exit 8)", async () => {
    // The mocked service returns a bundle signed by the throwaway test root,
    // which does not chain to the embedded production root.
    const signedBytes = await buildSignedBundle();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(signedBytes, {
            status: 200,
            headers: {
              "x-extension-id": "team.demo",
              "x-version": "1.2.0",
              "x-developer-id": "team",
              "x-signed-at": "1752710400",
              "x-bundle-sha256": "abc123",
            },
          }),
        ),
      ),
    );
    const ext = await makeExtensionDir();
    const outPath = join(dir, "o.aceworkflow");
    const code = await run(deps(["sign", ext, "--service", SERVICE, "--token", "wxst_test", "-o", outPath]));
    expect(code).toBe(ExitCode.VerifyFailed);
    expect(existsSync(outPath)).toBe(false);
  });
});

describe("service alias", () => {
  it("resolves --service <alias> from the config dir and names it in the banner", async () => {
    const configDir = join(dir, "cfg");
    await mkdir(configDir, { recursive: true });
    await writeFile(join(configDir, "config.json"), JSON.stringify({ services: { dev: "https://dev.example" } }));
    const ext = await makeExtensionDir();
    await run(deps(["pack", ext, "--service", "dev"], { configDir }));
    expect(err.join("")).toContain("dev → https://dev.example");
    expect(err.join("")).toContain("(overridden)");
  });

  it("errors on an unknown --service name with no matching alias", async () => {
    const ext = await makeExtensionDir();
    const code = await run(deps(["pack", ext, "--service", "staging"], { configDir: join(dir, "nonexistent") }));
    expect(code).toBe(ExitCode.Usage);
  });
});

describe("verify", () => {
  it("accepts a good bundle with an explicit root (exit 0)", async () => {
    const signer = await makeTestSigner();
    const signedBytes = await (async () => {
      const ext = await makeExtensionDir();
      const files = await packDir(ext);
      const signed = await signFiles(signer, files, {
        extensionId: "team.demo",
        developerId: "team",
        version: "1.2.0",
      });
      return writeZip(signed, FIXTURE_SIGNED_AT);
    })();
    const bundle = join(dir, "signed.aceworkflow");
    await writeFile(bundle, Buffer.from(signedBytes));
    const rootsFile = join(dir, "roots.json");
    await writeFile(rootsFile, rootsFileContent(signer));

    expect(await run(deps(["verify", bundle, "--roots", rootsFile]))).toBe(ExitCode.Success);
  });

  it("rejects a truncated bundle with exit 8", async () => {
    const bundle = join(dir, "bad.aceworkflow");
    await writeFile(bundle, "nonsense");
    const rootsFile = join(dir, "roots.json");
    await writeFile(rootsFile, rootsFileContent(await makeTestSigner()));
    expect(await run(deps(["verify", bundle, "--roots", rootsFile]))).toBe(ExitCode.VerifyFailed);
  });
});

describe("login / whoami / logout", () => {
  it("stores a token, reports it, then clears it", async () => {
    expect(await run(deps(["login", "--token", "wxst_stored", "--service", SERVICE]))).toBe(ExitCode.Success);
    expect(store.map.get(SERVICE)).toBe("wxst_stored");

    out = [];
    expect(await run(deps(["whoami", "--service", SERVICE, "--json"]))).toBe(ExitCode.Success);
    const info = JSON.parse(out.join("")) as { kind: string; source: string };
    expect(info.kind).toBe("registered");
    expect(info.source).toBe("store");

    expect(await run(deps(["logout", "--service", SERVICE]))).toBe(ExitCode.Success);
    expect(store.map.has(SERVICE)).toBe(false);
  });

  it("whoami exits 3 when no credential is present", async () => {
    expect(await run(deps(["whoami", "--service", SERVICE]))).toBe(ExitCode.MissingCredential);
  });

  it("bare login refuses in a non-interactive session", async () => {
    const code = await run(deps(["login", "--service", SERVICE, "--json"], { stdinIsTTY: false, stdoutIsTTY: false }));
    expect(code).toBe(ExitCode.Usage);
    expect(JSON.parse(out.join("")) as { code: string }).toMatchObject({ code: "usage" });
  });

  it("refuses an empty --token instead of persisting an unusable credential", async () => {
    const code = await run(deps(["login", "--token", "  ", "--service", SERVICE, "--json"]));
    expect(code).toBe(ExitCode.Usage);
    expect(JSON.parse(out.join("")) as { code: string }).toMatchObject({ code: "usage" });
  });

  it("stores a --token trimmed of surrounding whitespace", async () => {
    const code = await run(deps(["login", "--token", "  wxst_padded  ", "--service", SERVICE]));
    expect(code).toBe(ExitCode.Success);
    expect(store.map.get(SERVICE)).toBe("wxst_padded");
  });

  it("treats a truthy CI value as non-interactive even on a TTY", async () => {
    // With CI set, a bare login must refuse rather than prompt and hang a pipeline.
    const code = await run(
      deps(["login", "--service", SERVICE], { stdinIsTTY: true, stdoutIsTTY: true, env: { CI: "1" } }),
    );
    expect(code).toBe(ExitCode.Usage);
  });
});
