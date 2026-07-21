import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { classifyCredential } from "../src/credentials/classify";
import { FileCredentialStore } from "../src/credentials/store";
import { resolveCredential, TOKEN_ENV_VAR } from "../src/credentials/resolve";

const ORIGIN = "https://workflowext-signing.timedomain.dev";

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "aceworkflow-creds-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("classifyCredential", () => {
  it("recognises the ad-hoc secret prefix", () => {
    expect(classifyCredential("wxsa_deadbeef")).toBe("ad-hoc");
  });
  it("recognises the registered token prefix (forward-compat)", () => {
    expect(classifyCredential("wxst_deadbeef")).toBe("registered");
  });
  it("leaves an unknown prefix for the service to resolve", () => {
    expect(classifyCredential("something-else")).toBe("unknown");
  });
});

describe("FileCredentialStore", () => {
  it("round-trips a bearer keyed by origin", async () => {
    const store = new FileCredentialStore(dir);
    expect(await store.get(ORIGIN)).toBeNull();
    await store.set(ORIGIN, "wxsa_secret");
    expect(await store.get(ORIGIN)).toBe("wxsa_secret");
  });

  it("keeps distinct origins from colliding", async () => {
    const store = new FileCredentialStore(dir);
    await store.set(ORIGIN, "wxsa_prod");
    await store.set("https://workflowext-signing-dev.timedomain.dev", "wxsa_dev");
    expect(await store.get(ORIGIN)).toBe("wxsa_prod");
    expect(await store.get("https://workflowext-signing-dev.timedomain.dev")).toBe("wxsa_dev");
  });

  it("removes a stored bearer", async () => {
    const store = new FileCredentialStore(dir);
    await store.set(ORIGIN, "wxsa_secret");
    expect(await store.remove(ORIGIN)).toBe(true);
    expect(await store.get(ORIGIN)).toBeNull();
    expect(await store.remove(ORIGIN)).toBe(false);
  });

  it("writes the store file owner-only (0600)", async () => {
    const store = new FileCredentialStore(dir);
    await store.set(ORIGIN, "wxsa_secret");
    const mode = (await stat(join(dir, "credentials.json"))).mode & 0o777;
    if (process.platform !== "win32") {
      expect(mode).toBe(0o600);
    }
  });
});

describe("resolveCredential", () => {
  it("prefers an explicit --token over env and store", async () => {
    const store = new FileCredentialStore(dir);
    await store.set(ORIGIN, "wxsa_stored");
    const resolved = await resolveCredential({
      explicitToken: "wxst_flag",
      env: { [TOKEN_ENV_VAR]: "wxst_env" },
      store,
      origin: ORIGIN,
    });
    expect(resolved).toEqual({ bearer: "wxst_flag", source: "flag" });
  });

  it("lets env win over the store and never persists it", async () => {
    const store = new FileCredentialStore(dir);
    await store.set(ORIGIN, "wxsa_stored");
    const resolved = await resolveCredential({
      env: { [TOKEN_ENV_VAR]: "wxst_env" },
      store,
      origin: ORIGIN,
    });
    expect(resolved).toEqual({ bearer: "wxst_env", source: "env" });
    // The store is untouched by an env-var resolution.
    expect(await store.get(ORIGIN)).toBe("wxsa_stored");
  });

  it("falls back to the store when no flag or env is set", async () => {
    const store = new FileCredentialStore(dir);
    await store.set(ORIGIN, "wxsa_stored");
    const resolved = await resolveCredential({ env: {}, store, origin: ORIGIN });
    expect(resolved).toEqual({ bearer: "wxsa_stored", source: "store" });
  });

  it("returns null when nothing is available", async () => {
    const store = new FileCredentialStore(dir);
    const resolved = await resolveCredential({ env: {}, store, origin: ORIGIN });
    expect(resolved).toBeNull();
  });
});
