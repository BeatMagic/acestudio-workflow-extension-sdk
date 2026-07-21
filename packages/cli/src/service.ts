/**
 * Which signing service a command targets. Production is compiled in and
 * silent — the common path prints no backend URL. `--service` or
 * `ACEWORKFLOW_SERVICE` overrides it with any URL (dev, a local worker, a
 * preview) or a name from the user's own config aliases, and an override is
 * always announced so a command can never quietly hit a non-production
 * backend. No non-production environment is enumerated in this public source;
 * the override carries its own URL, or resolves one from the user's machine.
 */
export const PRODUCTION_SERVICE = "https://workflowext-signing.timedomain.dev";
export const SERVICE_ENV_VAR = "ACEWORKFLOW_SERVICE";

export class ServiceUrlError extends Error {}

export interface ResolvedService {
  url: URL;
  overridden: boolean;
  /** The alias name, when the override resolved through the user's config. */
  alias?: string;
}

export function resolveService(options: {
  flag?: string | undefined;
  env: NodeJS.ProcessEnv;
  aliases?: Record<string, string>;
}): ResolvedService {
  const raw = options.flag ?? options.env[SERVICE_ENV_VAR];
  if (raw === undefined || raw.length === 0) {
    return { url: withTrailingSlash(PRODUCTION_SERVICE), overridden: false };
  }
  const aliases = options.aliases ?? {};
  const aliased = aliases[raw];
  const target = aliased ?? raw;
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    throw new ServiceUrlError(
      aliased === undefined && !raw.includes("://")
        ? `unknown service "${raw}"; pass a URL or define it in config.json services`
        : `invalid service URL: ${target}`,
    );
  }
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return aliased !== undefined ? { url, overridden: true, alias: raw } : { url, overridden: true };
}

function withTrailingSlash(base: string): URL {
  const url = new URL(base);
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return url;
}
