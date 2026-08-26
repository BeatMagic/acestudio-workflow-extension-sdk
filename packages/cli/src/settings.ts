import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { appDataDir } from "./credentials/store";

/**
 * Per-service preferences this CLI writes, as distinct from the hand-authored
 * `config.json` that maps service aliases. Nothing here is secret; it is the
 * record of a choice already made, so that making it once is enough.
 */
interface SettingsFile {
  version: 1;
  services: Record<string, { adHoc?: boolean }>;
}

export function settingsPath(dir: string = appDataDir()): string {
  return join(dir, "settings.json");
}

async function read(path: string): Promise<SettingsFile> {
  try {
    const value = JSON.parse(await readFile(path, "utf-8")) as Partial<SettingsFile>;
    if (value.services !== null && typeof value.services === "object" && !Array.isArray(value.services)) {
      return { version: 1, services: value.services as SettingsFile["services"] };
    }
  } catch {
    // Missing or corrupt reads as empty; the next write rewrites it.
  }
  return { version: 1, services: {} };
}

/**
 * Whether this service is one the developer has said they sign ad-hoc against.
 * `sign --ad-hoc` still works as a one-off; this is what keeps them from having
 * to say it on every bundle once they have said it once.
 */
export async function prefersAdHoc(origin: string, dir?: string): Promise<boolean> {
  const file = await read(settingsPath(dir ?? appDataDir()));
  return file.services[origin]?.adHoc === true;
}

export async function setPrefersAdHoc(origin: string, value: boolean, dir?: string): Promise<void> {
  const base = dir ?? appDataDir();
  const path = settingsPath(base);
  const file = await read(path);
  if (value) file.services[origin] = { ...file.services[origin], adHoc: true };
  else delete file.services[origin];
  await mkdir(base, { recursive: true, mode: 0o700 });
  await writeFile(path, `${JSON.stringify(file, null, 2)}\n`, { mode: 0o600 });
}
