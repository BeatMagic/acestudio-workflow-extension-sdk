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

import type { ScopedBindings } from "@timedomain/acestudio-bridge-core";
import type { ExtensionManifest } from "./manifest.js";

/**
 * The client a manifest's `capabilities` reach: each domain keeps only the methods
 * those capabilities can call, a domain none of them reaches is absent entirely,
 * and ungated operations are there regardless.
 *
 * The manifest's list scopes this directly, with no expansion step in between: a
 * `RequestedCapability` is an atomic token, and the one name that used to stand
 * for a bundle here — a `surface.*` ceiling — is not something a manifest may
 * request at all.
 *
 * A manifest whose `capabilities` are not literal — one typed as
 * {@link ExtensionManifest} rather than written `as const` — reaches the whole
 * public surface, because there is nothing left to narrow by.
 *
 * @public
 */
export type ManifestClient<M extends ExtensionManifest> = ScopedBindings<M["capabilities"][number]>;
