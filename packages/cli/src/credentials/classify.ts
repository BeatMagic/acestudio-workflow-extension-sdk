/**
 * A cheap local guess at a credential's kind from its prefix — no round trip.
 * Ad-hoc bearer secrets are minted as `wxsa_…` (service `randomSecret`). When
 * registered API-token minting lands, its tokens should adopt a sibling
 * `wxst_…` prefix so the same sniff classifies both. Anything else is left to
 * the service, which is the only authority on what a bearer actually is.
 */
export type CredentialKind = "ad-hoc" | "registered" | "unknown";

export const ADHOC_SECRET_PREFIX = "wxsa_";
export const REGISTERED_TOKEN_PREFIX = "wxst_";

export function classifyCredential(bearer: string): CredentialKind {
  if (bearer.startsWith(ADHOC_SECRET_PREFIX)) return "ad-hoc";
  if (bearer.startsWith(REGISTERED_TOKEN_PREFIX)) return "registered";
  return "unknown";
}
