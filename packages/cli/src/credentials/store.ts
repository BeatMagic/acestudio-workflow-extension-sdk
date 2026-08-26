import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir, platform } from "node:os";
import { join } from "node:path";

/**
 * A stored credential: the bearer, plus the developer id it belongs to when
 * this CLI is in a position to know it.
 *
 * Only an ad-hoc identity minted here carries an id, and that asymmetry is the
 * service's, not a gap in this store: the submission API resolves a bearer to a
 * developer id server-side and exposes no endpoint to ask it, so a pasted API
 * token is opaque to us. What we minted, we remember; everything else stays
 * unknown until the service answers.
 */
export interface StoredCredential {
  bearer: string;
  /** The ad-hoc slug this bearer was minted under, when this CLI minted it. */
  developerId?: string;
}

/**
 * The key one credential is filed under. A registered API token is opaque —
 * the service resolves it to a developer id and offers no way to ask — so it
 * is the service's one default credential. An ad-hoc secret is bound to the id
 * it was minted under, and a developer may hold several, so each is filed
 * under its own identity rather than displacing the last one.
 */
export function credentialKey(origin: string, developerId?: string): string {
  return developerId === undefined ? origin : `${origin}#${developerId}`;
}

/**
 * Where cached bearers live. This build stores them in a `0600` file under
 * the OS app-data directory — the fallback layer of the credential model
 * (the OS keychain layer slots in behind this same interface later). Keyed by
 * service origin so a prod bearer and a dev bearer never collide, and by
 * identity within it so two ad-hoc identities on one service do not.
 */
export interface CredentialStore {
  /**
   * The credential to sign `developerId`'s bundles with: that identity's own
   * ad-hoc secret when there is one, else the service's default credential —
   * unless the default is an ad-hoc secret belonging to a *different*
   * identity, which is no more usable here than no credential at all.
   */
  get(origin: string, developerId?: string): Promise<StoredCredential | null>;
  set(origin: string, credential: StoredCredential): Promise<void>;
  /** Forgets every credential for the service, identity-scoped ones included. */
  remove(origin: string): Promise<boolean>;
}

export function appDataDir(): string {
  const home = homedir();
  switch (platform()) {
    case "win32":
      return join(process.env.APPDATA ?? join(home, "AppData", "Roaming"), "aceworkflow");
    case "darwin":
      return join(home, "Library", "Application Support", "aceworkflow");
    default:
      return join(process.env.XDG_CONFIG_HOME ?? join(home, ".config"), "aceworkflow");
  }
}

interface StoreFile {
  version: 1;
  services: Record<string, StoredCredential>;
}

export class FileCredentialStore implements CredentialStore {
  private readonly dir: string;
  private readonly path: string;

  constructor(dir: string = appDataDir()) {
    this.dir = dir;
    this.path = join(dir, "credentials.json");
  }

  async get(origin: string, developerId?: string): Promise<StoredCredential | null> {
    const file = await this.read();
    return pickCredential(
      (key) => file.services[key],
      origin,
      developerId,
    );
  }

  async set(origin: string, credential: StoredCredential): Promise<void> {
    const file = await this.read();
    // An absent developerId is written as an absent key, not `undefined`, so a
    // file round-trip never turns "unknown" into a literal null.
    file.services[credentialKey(origin, credential.developerId)] =
      credential.developerId !== undefined
        ? { bearer: credential.bearer, developerId: credential.developerId }
        : { bearer: credential.bearer };
    await this.write(file);
  }

  async remove(origin: string): Promise<boolean> {
    const file = await this.read();
    const keys = Object.keys(file.services).filter((key) => key === origin || key.startsWith(`${origin}#`));
    if (keys.length === 0) return false;
    for (const key of keys) delete file.services[key];
    await this.write(file);
    return true;
  }

  private async read(): Promise<StoreFile> {
    let text: string;
    try {
      text = await readFile(this.path, "utf-8");
    } catch {
      return { version: 1, services: {} };
    }
    try {
      const value = JSON.parse(text) as Partial<StoreFile>;
      if (value.services !== null && typeof value.services === "object" && !Array.isArray(value.services)) {
        return { version: 1, services: value.services as StoreFile["services"] };
      }
    } catch {
      // A corrupt store reads as empty rather than wedging every command; the
      // next set() rewrites it cleanly.
    }
    return { version: 1, services: {} };
  }

  private async write(file: StoreFile): Promise<void> {
    await mkdir(this.dir, { recursive: true, mode: 0o700 });
    // Written owner-only, and re-chmod'd in case the file predates this write.
    await writeFile(this.path, `${JSON.stringify(file, null, 2)}\n`, { mode: 0o600 });
    await chmod(this.path, 0o600);
  }
}

/**
 * The lookup both backends share: the identity's own credential first, then
 * the service default — but never a default that is some *other* identity's
 * ad-hoc secret, which the service would refuse with `namespace-violation`.
 * Returning null there is what lets ad-hoc mode mint the right one instead of
 * submitting a credential that cannot work.
 */
export function pickCredential(
  read: (key: string) => StoredCredential | null | undefined,
  origin: string,
  developerId?: string,
): StoredCredential | null {
  if (developerId !== undefined) {
    const scoped = read(credentialKey(origin, developerId));
    if (scoped != null && typeof scoped.bearer === "string") {
      return { bearer: scoped.bearer, developerId };
    }
  }
  const fallback = read(origin);
  if (fallback == null || typeof fallback.bearer !== "string") return null;
  if (fallback.developerId !== undefined && developerId !== undefined && fallback.developerId !== developerId) {
    return null;
  }
  return fallback.developerId !== undefined
    ? { bearer: fallback.bearer, developerId: fallback.developerId }
    : { bearer: fallback.bearer };
}
