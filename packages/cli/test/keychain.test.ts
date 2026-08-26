import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  KeychainCredentialStore,
  KeychainOrFileStore,
  keychainAvailable,
  defaultCredentialStore,
  napiKeyring,
  type KeyringPort,
} from "../src/credentials/keychain";
import { FileCredentialStore } from "../src/credentials/store";

const ORIGIN = "https://workflowext-signing.timedomain.dev";

class FakeKeyring implements KeyringPort {
  readonly store = new Map<string, string>();
  available = true;
  get(account: string): string | null {
    if (!this.available) throw new Error("no OS secret backend");
    return this.store.get(account) ?? null;
  }
  set(account: string, secret: string): void {
    if (!this.available) throw new Error("no OS secret backend");
    this.store.set(account, secret);
  }
  remove(account: string): boolean {
    if (!this.available) throw new Error("no OS secret backend");
    return this.store.delete(account);
  }
}

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "aceworkflow-keychain-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("keychainAvailable", () => {
  it("is true when a benign probe read succeeds", () => {
    expect(keychainAvailable(new FakeKeyring())).toBe(true);
  });
  it("is false when the backend errors", () => {
    const keyring = new FakeKeyring();
    keyring.available = false;
    expect(keychainAvailable(keyring)).toBe(false);
  });
});

describe("KeychainCredentialStore", () => {
  it("files an ad-hoc credential under its own identity", async () => {
    const store = new KeychainCredentialStore(new FakeKeyring());
    await store.set(ORIGIN, { bearer: "wxsa_secret", developerId: "acme" });
    expect(await store.get(ORIGIN, "acme")).toEqual({ bearer: "wxsa_secret", developerId: "acme" });
    // Not the service default: it belongs to one identity, not to the service.
    expect(await store.get(ORIGIN)).toBeNull();
  });

  it("keeps two identities on one service apart, and forgets both at logout", async () => {
    const keyring = new FakeKeyring();
    const store = new KeychainCredentialStore(keyring);
    await store.set(ORIGIN, { bearer: "wxsa_one", developerId: "acme" });
    await store.set(ORIGIN, { bearer: "wxsa_two", developerId: "acme-labs" });
    expect((await store.get(ORIGIN, "acme"))?.bearer).toBe("wxsa_one");
    expect((await store.get(ORIGIN, "acme-labs"))?.bearer).toBe("wxsa_two");
    expect(await store.remove(ORIGIN)).toBe(true);
    expect(await store.get(ORIGIN, "acme")).toBeNull();
    expect(await store.get(ORIGIN, "acme-labs")).toBeNull();
    expect(keyring.store.size).toBe(0);
  });

  it("reads a bare bearer written by an older build", async () => {
    // A keychain entry holds one string, and builds before the developer id
    // wrote the bearer straight in. Upgrading must not log anyone out.
    const keyring = new FakeKeyring();
    keyring.store.set(ORIGIN, "wxsa_legacy");
    const store = new KeychainCredentialStore(keyring);
    expect(await store.get(ORIGIN)).toEqual({ bearer: "wxsa_legacy" });
  });

  it("keeps a bearer with no developer id stored as a bare string", async () => {
    const keyring = new FakeKeyring();
    await new KeychainCredentialStore(keyring).set(ORIGIN, { bearer: "wxst_token" });
    expect(keyring.store.get(ORIGIN)).toBe("wxst_token");
  });

  it("round-trips a bearer keyed by origin", async () => {
    const store = new KeychainCredentialStore(new FakeKeyring());
    expect(await store.get(ORIGIN)).toBeNull();
    await store.set(ORIGIN, { bearer: "wxsa_secret" });
    expect((await store.get(ORIGIN))?.bearer).toBe("wxsa_secret");
    expect(await store.remove(ORIGIN)).toBe(true);
    expect(await store.get(ORIGIN)).toBeNull();
  });

  it("treats a backend error on remove as nothing-removed", async () => {
    const keyring = new FakeKeyring();
    keyring.available = false;
    const store = new KeychainCredentialStore(keyring);
    expect(await store.remove(ORIGIN)).toBe(false);
  });
});

describe("KeychainOrFileStore", () => {
  it("uses the keychain when the backend works", async () => {
    const keyring = new FakeKeyring();
    const fileStore = new FileCredentialStore(dir);
    const store = new KeychainOrFileStore(keyring, fileStore);
    await store.set(ORIGIN, { bearer: "wxsa_x" });
    expect(keyring.store.get(ORIGIN)).toBe("wxsa_x");
    expect(await fileStore.get(ORIGIN)).toBeNull();
  });

  it("falls back to the file store when the backend is unavailable", async () => {
    const keyring = new FakeKeyring();
    keyring.available = false;
    const fileStore = new FileCredentialStore(dir);
    const store = new KeychainOrFileStore(keyring, fileStore);
    await store.set(ORIGIN, { bearer: "wxsa_x" });
    expect((await fileStore.get(ORIGIN))?.bearer).toBe("wxsa_x");
    expect(keyring.store.size).toBe(0);
  });
});

describe("defaultCredentialStore", () => {
  it("forces the file store when ACEWORKFLOW_CREDENTIAL_STORE=file", () => {
    expect(defaultCredentialStore({ ACEWORKFLOW_CREDENTIAL_STORE: "file" })).toBeInstanceOf(FileCredentialStore);
  });
  it("returns the keychain-or-file store by default", () => {
    expect(defaultCredentialStore({})).toBeInstanceOf(KeychainOrFileStore);
  });
});

// A real round-trip against this machine's OS keychain. Opt-in — it writes to
// and deletes from the actual secret store — via ACEWORKFLOW_KEYCHAIN_TEST=1.
describe.skipIf(process.env.ACEWORKFLOW_KEYCHAIN_TEST !== "1")("real keychain", () => {
  it("stores and clears a throwaway secret", async () => {
    const store = new KeychainCredentialStore(napiKeyring);
    const origin = "https://aceworkflow-keychain-test.invalid";
    try {
      await store.set(origin, { bearer: "wxsa_throwaway" });
      expect((await store.get(origin))?.bearer).toBe("wxsa_throwaway");
    } finally {
      await store.remove(origin);
    }
    expect(await store.get(origin)).toBeNull();
  });
});
