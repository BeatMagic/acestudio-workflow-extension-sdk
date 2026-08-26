import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { run, type RunDeps } from "../src/app";
import { ExitCode } from "../src/exit-codes";
import { credentialKey, pickCredential } from "../src/credentials/store";
import type { CredentialStore, StoredCredential } from "../src/credentials/store";
import { packDir } from "../src/bundle/pack";
import { writeZip } from "../src/bundle/zip";
import { verifyBundleBytes } from "../src/verify/verify";
import {
  makeTestSigner,
  rootsOf,
  rootsFileContent,
  signedTrustRegistry,
  signFiles,
  FIXTURE_SIGNED_AT,
} from "./fixtures";

const SERVICE = "https://svc.example";

class MemoryStore implements CredentialStore {
  readonly map = new Map<string, StoredCredential>();
  async get(origin: string, developerId?: string): Promise<StoredCredential | null> {
    return pickCredential((key) => this.map.get(key), origin, developerId);
  }
  async set(origin: string, credential: StoredCredential): Promise<void> {
    this.map.set(credentialKey(origin, credential.developerId), credential);
  }
  async remove(origin: string): Promise<boolean> {
    const keys = [...this.map.keys()].filter((key) => key === origin || key.startsWith(`${origin}#`));
    for (const key of keys) this.map.delete(key);
    return keys.length > 0;
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
  await writeFile(join(ext, "manifest.json"), '{"id":"team.demo","version":"1.2.0","name":"Demo"}');
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
    expect(store.map.get(SERVICE)?.bearer).toBe("wxst_pasted");
  });
});

describe("ad-hoc identity", () => {
  /**
   * The trust registry is checked against the same anchor as a bundle, so a
   * test that wants it believed has to sign it with the fixture root and point
   * the CLI at that root — which is what `--roots` is for.
   */
  async function trustedRootsFile(): Promise<string> {
    const signer = await makeTestSigner();
    const path = join(dir, "roots.json");
    await writeFile(path, rootsFileContent(signer));
    return path;
  }

  /** A service that mints, signs, and serves a trust registry naming `partnerco`. */
  function mockService(options: { registry?: boolean } = {}): { mints: unknown[] } {
    const mints: unknown[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const href = String(url);
        if (href.endsWith("/ad-hoc/identities")) {
          const body = JSON.parse(String(init?.body)) as { developerId: string };
          mints.push(body);
          return new Response(JSON.stringify({ developerId: body.developerId, secret: "wxsa_minted" }), {
            status: 201,
          });
        }
        if (href.endsWith("/trust/trust-registry.json")) {
          if (options.registry !== true) return new Response("nope", { status: 404 });
          const signer = await makeTestSigner();
          const registry = await signedTrustRegistry(signer, { partnerco: "verified-partner" });
          return new Response(new TextDecoder().decode(registry), { status: 200 });
        }
        return new Response(new Uint8Array([1]), {
          status: 200,
          headers: {
            "x-extension-id": "team.demo",
            "x-developer-id": "team",
            "x-version": "1.2.0",
            "x-signed-at": "1752710400",
            "x-bundle-sha256": "abc123",
          },
        });
      }),
    );
    return { mints };
  }

  const signArgs = (ext: string) => ["sign", ext, "--service", SERVICE, "--no-verify", "-o", join(dir, "o.aceworkflow")];

  it("mints under the developer id the manifest declares, asking nothing", async () => {
    const svc = mockService();
    const ext = await makeExtensionDir(); // manifest id is `team.demo`
    expect(await run(deps([...signArgs(ext), "--ad-hoc"], { configDir: dir }))).toBe(ExitCode.Success);
    expect(svc.mints).toEqual([{ developerId: "team" }]);
    expect(store.map.get(credentialKey(SERVICE, "team"))).toEqual({ bearer: "wxsa_minted", developerId: "team" });
  });

  it("refuses to mint under a reserved slug, without reaching the service", async () => {
    const svc = mockService();
    const ext = join(dir, "reserved");
    await mkdir(ext, { recursive: true });
    await writeFile(join(ext, "manifest.json"), '{"id":"acestudio.demo","version":"1.0.0","name":"Demo"}');
    expect(await run(deps([...signArgs(ext), "--ad-hoc"], { configDir: dir }))).toBe(ExitCode.Usage);
    expect(svc.mints).toEqual([]);
    expect(err.join("")).toContain("reserved for ACE");
  });

  it("refuses to mint under an identity the trust registry says is registered", async () => {
    const roots = await trustedRootsFile();
    const svc = mockService({ registry: true });
    const ext = join(dir, "partner");
    await mkdir(ext, { recursive: true });
    await writeFile(join(ext, "manifest.json"), '{"id":"partnerco.demo","version":"1.0.0","name":"Demo"}');
    // The service would refuse this with elevated-tier-conflict; catching it
    // here also means no useless identity is left behind.
    const code = await run(deps([...signArgs(ext), "--ad-hoc", "--roots", roots], { configDir: dir }));
    expect(code, err.join("")).toBe(ExitCode.IdentityRefused);
    expect(svc.mints).toEqual([]);
    expect(err.join("")).toContain("verified-partner");
  });

  it("refuses a cached ad-hoc credential against a registered identity too", async () => {
    const roots = await trustedRootsFile();
    await store.set(SERVICE, { bearer: "wxsa_cached", developerId: "partnerco" });
    mockService({ registry: true });
    const ext = join(dir, "partner2");
    await mkdir(ext, { recursive: true });
    await writeFile(join(ext, "manifest.json"), '{"id":"partnerco.demo","version":"1.0.0","name":"Demo"}');
    const code = await run(deps([...signArgs(ext), "--roots", roots], { configDir: dir }));
    expect(code, err.join("")).toBe(ExitCode.IdentityRefused);
  });

  it("signs under a cached ad-hoc identity without minting a second one", async () => {
    await store.set(SERVICE, { bearer: "wxsa_cached", developerId: "team" });
    const svc = mockService({ registry: true });
    const ext = await makeExtensionDir();
    expect(await run(deps(signArgs(ext), { configDir: dir }))).toBe(ExitCode.Success);
    expect(svc.mints).toEqual([]);
  });

  it("leaves another identity's ad-hoc credential alone rather than signing with it", async () => {
    await store.set(SERVICE, { bearer: "wxsa_cached", developerId: "someone-else" });
    const svc = mockService({ registry: true });
    const ext = await makeExtensionDir(); // manifest id is `team.demo`
    // An ad-hoc secret is bound to the id it was minted under, so it is no more
    // usable for `team` than no credential at all. Nothing is warned about and
    // nothing is minted: `--ad-hoc` was not asked for, so this is the ordinary
    // missing-credential path.
    expect(await run(deps(signArgs(ext), { configDir: dir }))).toBe(ExitCode.MissingCredential);
    expect(svc.mints).toEqual([]);
    expect(store.map.get(credentialKey(SERVICE, "someone-else"))).toEqual({
      bearer: "wxsa_cached",
      developerId: "someone-else",
    });
  });

  it("rejects --developer-id, which no longer exists", async () => {
    const ext = await makeExtensionDir();
    expect(await run(deps([...signArgs(ext), "--developer-id", "acme"]))).toBe(ExitCode.Usage);
  });

  it("records ad-hoc at login without minting anything, and needs no terminal", async () => {
    // There is nothing to mint at login: the identity lives in a manifest, and
    // which one is needed is not knowable until there is a bundle.
    const svc = mockService();
    expect(await run(deps(["login", "--ad-hoc", "--service", SERVICE], { configDir: dir }))).toBe(ExitCode.Success);
    expect(svc.mints).toEqual([]);
  });

  it("mints without --ad-hoc once login recorded it", async () => {
    const svc = mockService();
    await run(deps(["login", "--ad-hoc", "--service", SERVICE], { configDir: dir }));
    const ext = await makeExtensionDir();
    expect(await run(deps(signArgs(ext), { configDir: dir }))).toBe(ExitCode.Success);
    expect(svc.mints).toEqual([{ developerId: "team" }]);
  });

  it("still refuses to mint when nothing said ad-hoc", async () => {
    const svc = mockService();
    const ext = await makeExtensionDir();
    expect(await run(deps(signArgs(ext), { configDir: dir }))).toBe(ExitCode.MissingCredential);
    expect(svc.mints).toEqual([]);
  });

  it("forgets the recorded mode at logout, so signing stops minting", async () => {
    const svc = mockService();
    await run(deps(["login", "--ad-hoc", "--service", SERVICE], { configDir: dir }));
    expect(await run(deps(["logout", "--service", SERVICE], { configDir: dir }))).toBe(ExitCode.Success);
    const ext = await makeExtensionDir();
    expect(await run(deps(signArgs(ext), { configDir: dir }))).toBe(ExitCode.MissingCredential);
    expect(svc.mints).toEqual([]);
  });

  it("mints a second identity rather than reusing the first one's credential", async () => {
    // One developer, two identities, one service. Keying credentials by origin
    // alone made the second unsignable.
    const svc = mockService();
    await run(deps(["login", "--ad-hoc", "--service", SERVICE], { configDir: dir }));
    await run(deps(signArgs(await makeExtensionDir()), { configDir: dir }));

    const other = join(dir, "other");
    await mkdir(other, { recursive: true });
    await writeFile(join(other, "manifest.json"), '{"id":"team-labs.demo","version":"1.0.0","name":"Demo"}');
    expect(await run(deps(signArgs(other), { configDir: dir }))).toBe(ExitCode.Success);

    expect(svc.mints).toEqual([{ developerId: "team" }, { developerId: "team-labs" }]);
    expect(store.map.get(`${SERVICE}#team`)?.bearer).toBe("wxsa_minted");
    expect(store.map.get(`${SERVICE}#team-labs`)?.bearer).toBe("wxsa_minted");
  });

  it("signs ad-hoc after `login --ad-hoc`, even with a token stored before it", async () => {
    // "from now on" has to outrank a credential already on disk, or the mode
    // switch is silently a no-op for anyone who had signed in with a token.
    const svc = mockService();
    await run(deps(["login", "--token", "wxst_stored", "--service", SERVICE], { configDir: dir }));
    await run(deps(["login", "--ad-hoc", "--service", SERVICE], { configDir: dir }));

    expect(await run(deps(signArgs(await makeExtensionDir()), { configDir: dir }))).toBe(ExitCode.Success);
    expect(svc.mints).toEqual([{ developerId: "team" }]);
    // Switching modes does not destroy the token; it is just not what ad-hoc
    // mode signs with, so switching back needs no re-paste.
    expect(store.map.get(SERVICE)?.bearer).toBe("wxst_stored");
  });

  it("goes back to the token when `login --token` follows ad-hoc mode", async () => {
    const svc = mockService();
    await run(deps(["login", "--ad-hoc", "--service", SERVICE], { configDir: dir }));
    await run(deps(["login", "--token", "wxst_stored", "--service", SERVICE], { configDir: dir }));

    expect(await run(deps(signArgs(await makeExtensionDir()), { configDir: dir }))).toBe(ExitCode.Success);
    expect(svc.mints).toEqual([]);
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
    expect(store.map.get(SERVICE)?.bearer).toBe("wxst_stored");

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
    expect(store.map.get(SERVICE)?.bearer).toBe("wxst_padded");
  });

  it("treats a truthy CI value as non-interactive even on a TTY", async () => {
    // With CI set, a bare login must refuse rather than prompt and hang a pipeline.
    const code = await run(
      deps(["login", "--service", SERVICE], { stdinIsTTY: true, stdoutIsTTY: true, env: { CI: "1" } }),
    );
    expect(code).toBe(ExitCode.Usage);
  });
});
