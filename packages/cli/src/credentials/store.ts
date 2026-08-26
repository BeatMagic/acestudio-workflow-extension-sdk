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
 * Where cached bearers live. This build stores them in a `0600` file under
 * the OS app-data directory — the fallback layer of the credential model
 * (the OS keychain layer slots in behind this same interface later). Keyed by
 * service origin so a prod bearer and a dev bearer never collide.
 */
export interface CredentialStore {
  get(origin: string): Promise<StoredCredential | null>;
  set(origin: string, credential: StoredCredential): Promise<void>;
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

  async get(origin: string): Promise<StoredCredential | null> {
    const file = await this.read();
    const entry = file.services[origin];
    if (entry === undefined || typeof entry.bearer !== "string") return null;
    return entry.developerId !== undefined
      ? { bearer: entry.bearer, developerId: entry.developerId }
      : { bearer: entry.bearer };
  }

  async set(origin: string, credential: StoredCredential): Promise<void> {
    const file = await this.read();
    // An absent developerId is written as an absent key, not `undefined`, so a
    // file round-trip never turns "unknown" into a literal null.
    file.services[origin] =
      credential.developerId !== undefined
        ? { bearer: credential.bearer, developerId: credential.developerId }
        : { bearer: credential.bearer };
    await this.write(file);
  }

  async remove(origin: string): Promise<boolean> {
    const file = await this.read();
    if (file.services[origin] === undefined) return false;
    delete file.services[origin];
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
