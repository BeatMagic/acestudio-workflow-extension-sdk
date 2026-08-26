import { createRequire } from "node:module";
import type { Entry as KeyringEntry } from "@napi-rs/keyring";
import {
  credentialKey,
  FileCredentialStore,
  pickCredential,
  type CredentialStore,
  type StoredCredential,
} from "./store";

/** The service name every entry is filed under in the OS store. */
export const KEYCHAIN_SERVICE = "aceworkflow";

/**
 * A minimal port over an OS secret store, so the store logic is testable with
 * a fake and never touches a real keychain in tests. `get` returns null when
 * there is no entry; every method throws when the OS backend is unavailable —
 * that thrown-ness is what the file fallback keys off.
 */
export interface KeyringPort {
  get(account: string): string | null;
  set(account: string, secret: string): void;
  remove(account: string): boolean;
}

// The native addon is loaded lazily and defensively: a missing or
// incompatible binary (headless Linux with no secret service, an unsupported
// libc) must degrade to the file store, never crash the CLI at startup.
const requireCjs = createRequire(import.meta.url);
let cachedCtor: typeof KeyringEntry | null | undefined;

function entryCtor(): typeof KeyringEntry | null {
  if (cachedCtor === undefined) {
    try {
      cachedCtor = (requireCjs("@napi-rs/keyring") as { Entry: typeof KeyringEntry }).Entry;
    } catch {
      cachedCtor = null;
    }
  }
  return cachedCtor;
}

function requireCtor(): typeof KeyringEntry {
  const ctor = entryCtor();
  if (ctor === null) throw new Error("@napi-rs/keyring native module is unavailable");
  return ctor;
}

export const napiKeyring: KeyringPort = {
  get(account) {
    const Entry = requireCtor();
    return new Entry(KEYCHAIN_SERVICE, account).getPassword() ?? null;
  },
  set(account, secret) {
    const Entry = requireCtor();
    new Entry(KEYCHAIN_SERVICE, account).setPassword(secret);
  },
  remove(account) {
    const Entry = requireCtor();
    return new Entry(KEYCHAIN_SERVICE, account).deleteCredential();
  },
};

const PROBE_ACCOUNT = "__aceworkflow_probe__";

/** True when the OS secret store answers a benign, side-effect-free read. */
export function keychainAvailable(keyring: KeyringPort = napiKeyring): boolean {
  try {
    keyring.get(PROBE_ACCOUNT);
    return true;
  } catch {
    return false;
  }
}

/**
 * A keychain entry holds one string, so a credential that carries a developer
 * id is stored as JSON. Reading tolerates both shapes: anything that is not a
 * JSON object with a string `bearer` is a bare bearer written by an older
 * build (or by hand), which keeps upgrades from silently logging people out.
 */
export function parseKeychainSecret(secret: string): StoredCredential {
  try {
    const value: unknown = JSON.parse(secret);
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const record = value as Record<string, unknown>;
      if (typeof record.bearer === "string") {
        return typeof record.developerId === "string"
          ? { bearer: record.bearer, developerId: record.developerId }
          : { bearer: record.bearer };
      }
    }
  } catch {
    // Not JSON — a bare bearer.
  }
  return { bearer: secret };
}

/** The inverse: a bare string while there is nothing else to carry. */
export function formatKeychainSecret(credential: StoredCredential): string {
  return credential.developerId === undefined ? credential.bearer : JSON.stringify(credential);
}

/** A CredentialStore backed by the OS keychain, keyed by service origin. */
export class KeychainCredentialStore implements CredentialStore {
  constructor(private readonly keyring: KeyringPort = napiKeyring) {}

  async get(origin: string, developerId?: string): Promise<StoredCredential | null> {
    return pickCredential(
      (key) => {
        const secret = this.keyring.get(key);
        return secret === null ? null : parseKeychainSecret(secret);
      },
      origin,
      developerId,
    );
  }

  async set(origin: string, credential: StoredCredential): Promise<void> {
    this.keyring.set(credentialKey(origin, credential.developerId), formatKeychainSecret(credential));
    if (credential.developerId !== undefined) this.remember(origin, credential.developerId);
  }

  async remove(origin: string): Promise<boolean> {
    // An OS secret store has no prefix scan, so the identities a service holds
    // are tracked in one index entry — without it, `logout` would leave every
    // identity-scoped secret behind with no way to name it again.
    let removed = this.forget(origin);
    for (const developerId of this.index(origin)) {
      if (this.forget(credentialKey(origin, developerId))) removed = true;
    }
    if (this.forget(indexKey(origin))) removed = true;
    return removed;
  }

  private forget(key: string): boolean {
    // deleteCredential throws when there is nothing to delete; that is a
    // successful "nothing removed", not an error worth surfacing.
    try {
      return this.keyring.remove(key);
    } catch {
      return false;
    }
  }

  private index(origin: string): string[] {
    try {
      const raw = this.keyring.get(indexKey(origin));
      if (raw === null) return [];
      const value: unknown = JSON.parse(raw);
      return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
    } catch {
      return [];
    }
  }

  private remember(origin: string, developerId: string): void {
    const known = this.index(origin);
    if (known.includes(developerId)) return;
    try {
      this.keyring.set(indexKey(origin), JSON.stringify([...known, developerId]));
    } catch {
      // A missing index costs a stale secret at logout, not a failed login.
    }
  }
}

/** Where the list of identity-scoped accounts for a service is kept. */
function indexKey(origin: string): string {
  return `${origin}#identities`;
}

/**
 * Keychain-first, file-fallback — Git's credential-helper model. The backend
 * is chosen once, lazily, on first use: a probe decides whether the OS store
 * is usable, and everything after routes to the same choice. Commands that
 * never touch a credential (pack, verify) pay nothing.
 */
export class KeychainOrFileStore implements CredentialStore {
  private backend: CredentialStore | null = null;

  constructor(
    private readonly keyring: KeyringPort = napiKeyring,
    private readonly fileStore: CredentialStore = new FileCredentialStore(),
  ) {}

  private pick(): CredentialStore {
    if (this.backend === null) {
      this.backend = keychainAvailable(this.keyring) ? new KeychainCredentialStore(this.keyring) : this.fileStore;
    }
    return this.backend;
  }

  async get(origin: string, developerId?: string): Promise<StoredCredential | null> {
    return this.pick().get(origin, developerId);
  }
  async set(origin: string, credential: StoredCredential): Promise<void> {
    return this.pick().set(origin, credential);
  }
  async remove(origin: string): Promise<boolean> {
    return this.pick().remove(origin);
  }
}

/**
 * The default store: the OS keychain when it works, a `0600` file otherwise.
 * `ACEWORKFLOW_CREDENTIAL_STORE=file` forces the file store — an escape hatch
 * for CI images and debugging where the keychain is unwanted.
 */
export function defaultCredentialStore(env: NodeJS.ProcessEnv): CredentialStore {
  if ((env.ACEWORKFLOW_CREDENTIAL_STORE ?? "").toLowerCase() === "file") {
    return new FileCredentialStore();
  }
  return new KeychainOrFileStore();
}
