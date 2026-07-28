/**
 * A session's capability reach, and the refusal that names what it lacks.
 *
 * @remarks
 * The grant is settled at the handshake and never changes: an extension's reach
 * is the consent record captured at install, not something it can widen at
 * runtime. So this is a value to read, with no way to add a token to it.
 *
 * The refusal here is the same one the host composes, deliberately: a call the
 * grant cannot reach is denied locally with the code, details, and wording
 * `CommandRegistry::capabilityDenial` would have answered with, so a caller
 * cannot tell — and does not need to know — which side refused it.
 */

import { BridgeError } from "./errors.js";
import { CAPABILITY_TOKENS, PROFILES, type CapabilityToken } from "./generated/bindings.js";

/**
 * A published Capability Profile's name — a named bundle of tokens a grant can
 * be measured against, rather than a list every consumer restates.
 *
 * @public
 */
export type ProfileName = keyof typeof PROFILES;

/**
 * Where a grant came from, for the log line that explains a denial nobody
 * expected. Not a contract to branch on — read {@link Grant.tokens} for that.
 *
 * @public
 */
export interface GrantProvenance {
  /** The session the host minted this grant for. */
  readonly sessionId: string;
  /** The capability names `connect()` asked for, in the caller's order. */
  readonly requested: readonly string[];
  /** Every name the host granted, verbatim — including any of the below. */
  readonly granted: readonly string[];
  /**
   * Granted names these bindings cannot name: a first-party token, or one
   * minted after this SDK was generated. They are honoured on the wire and
   * absent from {@link Grant.tokens}, which is why they are listed here rather
   * than dropped — a call failing `CAPABILITY_DENIED` for a token the host says
   * it granted is otherwise an unexplainable bug.
   */
  readonly unrecognized: readonly string[];
}

/**
 * What a session may reach.
 *
 * @public
 */
export interface Grant {
  /**
   * The granted tokens this artifact can name, sorted. Typed as the generated
   * union, so a token name autocompletes and a typo is a compile error.
   */
  readonly tokens: readonly CapabilityToken[];
  /** How this grant came about. */
  readonly provenance: GrantProvenance;
  /** Whether one token is granted. */
  has(token: CapabilityToken): boolean;
  /**
   * The tokens of `profileOrTokens` this grant does *not* hold, sorted — empty
   * when the whole set is granted. For consumers that work with a partial
   * grant: ask what is missing, then decide what to offer, rather than probing
   * token by token.
   *
   * @throws BridgeError with code `UNKNOWN_CAPABILITY` if a profile name is not
   * one this artifact publishes. A name that fails at runtime got past the type
   * from untyped JavaScript.
   */
  missing(profileOrTokens: ProfileName | readonly CapabilityToken[]): readonly CapabilityToken[];
}

/** Build the immutable grant a handshake result describes. */
export function createGrant(provenance: GrantProvenance): Grant {
  const granted = new Set(provenance.granted);
  const tokens = Object.freeze(
    provenance.granted.filter((name): name is CapabilityToken => !provenance.unrecognized.includes(name)).sort(),
  );
  return Object.freeze({
    tokens,
    provenance: Object.freeze(provenance),
    has: (token: CapabilityToken) => granted.has(token),
    missing: (profileOrTokens: ProfileName | readonly CapabilityToken[]) =>
      Object.freeze(resolveTokens(profileOrTokens).filter((token) => !granted.has(token)).sort()),
  });
}

/**
 * The granted names these bindings cannot name — a first-party token, or one
 * minted after this artifact was generated. Kept rather than dropped: the grant
 * is the host's answer, not this artifact's idea of what the host could say.
 */
export function unrecognizedTokens(granted: readonly string[]): string[] {
  const roster: ReadonlySet<string> = new Set(CAPABILITY_TOKENS);
  return granted.filter((name) => !roster.has(name));
}

/**
 * Assert a grant reaches every one of `tokens`, so a consumer can fail at
 * startup instead of mid-way through work it cannot finish.
 *
 * @throws BridgeError with code `CAPABILITY_DENIED`, naming every missing token
 * rather than the first — an extension whose manifest is short by three
 * capabilities should learn that once.
 */
export function requireTokens(grant: Grant, tokens: readonly CapabilityToken[]): void {
  const missing = grant.missing(tokens);
  if (missing.length === 0) {
    return;
  }
  throw new BridgeError({
    code: "CAPABILITY_DENIED",
    message: `this session's grant is missing ${missing.length === 1 ? "the capability" : "the capabilities"} ${missing.join(", ")}`,
    details: { missing: [...missing] },
    hint: "declare the capability in the extension manifest, and re-consent if it is already installed",
  });
}

/**
 * The refusal for a call the grant cannot reach — the pre-wire guard's whole
 * output, and a transcription of the host's `capabilityDenial`: same canonical
 * code, same `details.token`, same message and hint. Only the code and the
 * details are contract (the generated bindings say as much about messages), but
 * matching the wording too means a denial reads identically in a log whichever
 * side produced it.
 *
 * @internal
 */
export function capabilityDenied(path: string, token: string): BridgeError {
  return new BridgeError({
    code: "CAPABILITY_DENIED",
    // `missing` beside `token` is what the wire-borne refusal is normalized to
    // as well (see `normalizeDetails` in peer.ts), so the two are one error.
    message: `capability denied for command: ${path}`,
    details: { token, missing: [token] },
    hint: `missing capability token: ${token}`,
  });
}

/** The token list a profile name or an explicit list stands for. */
function resolveTokens(profileOrTokens: ProfileName | readonly CapabilityToken[]): readonly CapabilityToken[] {
  if (Array.isArray(profileOrTokens)) {
    return profileOrTokens as readonly CapabilityToken[];
  }
  const profile = PROFILES[profileOrTokens as ProfileName] as readonly CapabilityToken[] | undefined;
  if (profile === undefined) {
    throw new BridgeError({
      code: "UNKNOWN_CAPABILITY",
      message: `no published Capability Profile is named '${String(profileOrTokens)}'`,
      details: { requested: String(profileOrTokens), published: Object.keys(PROFILES) },
      hint: "profile names are versioned — check the suffix, e.g. surface.extension-sdk.v1",
    });
  }
  return profile;
}
