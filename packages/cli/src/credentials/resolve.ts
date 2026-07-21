import type { CredentialStore } from "./store";

export const TOKEN_ENV_VAR = "ACEWORKFLOW_TOKEN";

export type CredentialSource = "flag" | "env" | "store";

export interface ResolvedCredential {
  bearer: string;
  source: CredentialSource;
}

/**
 * Resolves the bearer for a service in precedence order:
 * `--token` > `ACEWORKFLOW_TOKEN` > the cached store. The env var always wins
 * over the store and never writes to it — that is the CI/agent path, where a
 * pipeline injects the credential and nothing should persist. Returns null
 * when nothing usable is found; blank/whitespace-only values are ignored, and
 * a returned bearer is trimmed so a stray-whitespace entry never becomes an
 * unusable Authorization header. The caller decides whether to prompt, mint,
 * or fail.
 */
export async function resolveCredential(options: {
  explicitToken?: string | undefined;
  env: NodeJS.ProcessEnv;
  store: CredentialStore;
  origin: string;
}): Promise<ResolvedCredential | null> {
  const { explicitToken, env, store, origin } = options;
  const flag = explicitToken?.trim();
  if (flag !== undefined && flag.length > 0) {
    return { bearer: flag, source: "flag" };
  }
  const fromEnv = env[TOKEN_ENV_VAR]?.trim();
  if (fromEnv !== undefined && fromEnv.length > 0) {
    return { bearer: fromEnv, source: "env" };
  }
  const stored = (await store.get(origin))?.trim();
  if (stored !== undefined && stored.length > 0) {
    return { bearer: stored, source: "store" };
  }
  return null;
}
