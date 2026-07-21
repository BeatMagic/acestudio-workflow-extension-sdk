import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { appDataDir } from "./credentials/store";

/**
 * A user-level config, stored next to the credential file in the OS app-data
 * directory. Its `services` map lets an operator alias a name to a service URL
 * (`--service dev`) from their *own* machine — no non-production host is
 * enumerated in this public source (the aws-profiles / kubectl-contexts model).
 */
export function configPath(dir: string = appDataDir()): string {
  return join(dir, "config.json");
}

/** Reads the `services` alias map, tolerating a missing or malformed file. */
export async function loadServiceAliases(dir?: string): Promise<Record<string, string>> {
  let text: string;
  try {
    text = await readFile(configPath(dir), "utf-8");
  } catch {
    return {};
  }
  try {
    const value = JSON.parse(text) as { services?: unknown };
    if (typeof value.services !== "object" || value.services === null || Array.isArray(value.services)) {
      return {};
    }
    const aliases: Record<string, string> = {};
    for (const [name, url] of Object.entries(value.services)) {
      if (typeof url === "string" && url.length > 0) aliases[name] = url;
    }
    return aliases;
  } catch {
    return {};
  }
}
