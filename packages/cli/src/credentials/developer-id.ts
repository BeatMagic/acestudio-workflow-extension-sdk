import { isValidDeveloperSlug } from "@timedomain/workflowext-verifier";

/**
 * Slugs the signing service holds back for identities at the Official trust
 * tier. Mirrored here so the common mistake costs no round trip — the service
 * is still the authority, and it re-checks (`reserved-slug`) on every mint. A
 * mirror that drifts stale only ever loses the local shortcut, never the rule.
 */
export const RESERVED_DEVELOPER_SLUGS: readonly string[] = ["acestudio", "acemusic", "beatmagic", "timedomain"];

export type SlugRefusal = { ok: true } | { ok: false; message: string };

/**
 * The best-effort local check on a chosen ad-hoc slug: shape, then the
 * reserved list. Everything else a slug can collide with — a registered
 * developer, a label refused for fraud — is server state this CLI cannot see,
 * so those come back from the mint as the service's own error.
 */
export function checkDeveloperSlug(slug: string): SlugRefusal {
  if (!isValidDeveloperSlug(slug)) {
    return {
      ok: false,
      message: `"${slug}" is not a valid developer id; use lowercase letters, digits and inner hyphens (at most 64 characters)`,
    };
  }
  if (RESERVED_DEVELOPER_SLUGS.includes(slug)) {
    return { ok: false, message: `"${slug}" is reserved for ACE; choose a different developer id` };
  }
  return { ok: true };
}

/** The developer segment of an extension id — what the service checks a bundle against. */
export function developerIdOf(extensionId: string): string | null {
  const first = extensionId.split(".")[0];
  return first !== undefined && first.length > 0 ? first : null;
}
