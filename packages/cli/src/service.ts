/**
 * Which signing service a command targets. Production is compiled in and
 * silent — the common path prints no backend URL. `--service` or
 * `ACEWORKFLOW_SERVICE` overrides it with any URL (dev, a local worker, a
 * preview), and an override is always announced so a command can never
 * quietly hit a non-production backend. No non-production environment is
 * enumerated in this public source; the override carries its own URL.
 */
export const PRODUCTION_SERVICE = "https://workflowext-signing.timedomain.dev";
export const SERVICE_ENV_VAR = "ACEWORKFLOW_SERVICE";

export class ServiceUrlError extends Error {}

export interface ResolvedService {
  url: URL;
  overridden: boolean;
}

export function resolveService(options: { flag?: string | undefined; env: NodeJS.ProcessEnv }): ResolvedService {
  const raw = options.flag ?? options.env[SERVICE_ENV_VAR];
  const overridden = raw !== undefined && raw.length > 0;
  const target = overridden ? raw : PRODUCTION_SERVICE;
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    throw new ServiceUrlError(`invalid service URL: ${target}`);
  }
  // A trailing slash makes `new URL("submissions", url)` resolve *under* the
  // base rather than replacing its last path segment.
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return { url, overridden };
}
