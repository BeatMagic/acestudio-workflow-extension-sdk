import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir, platform } from "node:os";
import { join } from "node:path";

/**
 * Where cached bearers live. This build stores them in a `0600` file under
 * the OS app-data directory — the fallback layer of the credential model
 * (the OS keychain layer slots in behind this same interface later). Keyed by
 * service origin so a prod bearer and a dev bearer never collide.
 */
export interface CredentialStore {
  get(origin: string): Promise<string | null>;
  set(origin: string, bearer: string): Promise<void>;
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
  services: Record<string, { bearer: string }>;
}

export class FileCredentialStore implements CredentialStore {
  private readonly dir: string;
  private readonly path: string;

  constructor(dir: string = appDataDir()) {
    this.dir = dir;
    this.path = join(dir, "credentials.json");
  }

  async get(origin: string): Promise<string | null> {
    const file = await this.read();
    return file.services[origin]?.bearer ?? null;
  }

  async set(origin: string, bearer: string): Promise<void> {
    const file = await this.read();
    file.services[origin] = { bearer };
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
      if (value.services !== null && typeof value.services === "object") {
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
