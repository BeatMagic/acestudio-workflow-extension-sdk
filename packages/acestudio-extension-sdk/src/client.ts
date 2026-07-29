/**
 * The manifest-scoped client: the operation surface a manifest's capability
 * request reaches, and nothing else.
 *
 * @remarks
 * An extension never scopes its client by hand. Its manifest *is* the requested
 * set — fixed at install, and the same list the user consented to — so the entry
 * API can hand handlers a client already typed to it. A call outside that set is
 * then a compile error rather than a `CAPABILITY_DENIED` on someone's machine.
 *
 * There is no runtime here. Core's capability facade is a compile-time view of the
 * same client object, and the pre-wire guard inside the bindings is what actually
 * refuses an ungranted call — which is why this narrowing can never disagree with
 * the enforcement.
 */

import type { CapabilityToken, ProfileName, ProfileTokens, ScopedBindings } from "@timedomain/acestudio-bridge-core";
import type { ExtensionManifest, RequestedCapability } from "./manifest.js";

/**
 * The tokens one requested name stands for: a profile expands to its bundle, a
 * token stands for itself.
 *
 * @public
 */
export type CapabilityTokensOf<C extends RequestedCapability> = C extends ProfileName
  ? ProfileTokens<C>
  : C extends CapabilityToken
    ? C
    : never;

/**
 * The client a manifest's `capabilities` reach: each domain keeps only the methods
 * those capabilities can call, a domain none of them reaches is absent entirely,
 * and ungated operations are there regardless.
 *
 * A manifest whose `capabilities` are not literal — one typed as
 * {@link ExtensionManifest} rather than written `as const` — reaches the whole
 * public surface, because there is nothing left to narrow by.
 *
 * @public
 */
export type ManifestClient<M extends ExtensionManifest> = ScopedBindings<
  CapabilityTokensOf<M["capabilities"][number]>
>;
