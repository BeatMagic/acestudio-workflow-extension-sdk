/**
 * The capability facade: a client typed down to the reach of a set of tokens.
 *
 * @remarks
 * There is no runtime here on purpose. `connection.scoped(...)` hands back the
 * *same* client object with a narrower type, so scoping costs nothing at run
 * time and cannot drift from the guard: the pre-wire check in `bindings.ts` is
 * still what refuses an ungranted call, and this only decides what the compiler
 * offers you in the first place.
 *
 * It reads the generated tables as types, which is why they are emitted
 * `as const` — an annotated `Record<string, CapabilityToken>` would have erased
 * exactly the fact each lookup needs.
 */

import { OPERATIONS, PROFILES, type CapabilityToken, type PublicBindings } from "./generated/bindings.js";
import type { ProfileName } from "./grant.js";

/**
 * One row of the generated operation table, with its literal types intact.
 *
 * @public
 */
export type Descriptor = (typeof OPERATIONS)[number];

/**
 * Turns `special-tracks` into `specialTracks`: the canonical tree hyphenates a
 * multi-word domain and the binding surface camelCases it. The runtime
 * counterpart is `camelCase()` in `bindings.ts`; the two have to agree, and the
 * `keyof PublicBindings` constraints below are what notices if they stop.
 *
 * Exported because {@link ScopedBindings} is written in terms of it, and a
 * recursive conditional type cannot be inlined into the mapped type that uses it.
 *
 * @public
 */
export type Camel<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}${Capitalize<Camel<Tail>>}`
  : S;

/**
 * The operations a session holding `T` can reach: everything it has the token
 * for, plus every ungated operation — a registry-declared pure function is
 * reachable by any session, including one granted nothing at all.
 *
 * @public
 */
export type Reachable<T extends CapabilityToken> = Extract<Descriptor, { ungated: true } | { capability: T }>;

/**
 * Reachable operations that nest under a domain, and those that do not. Exported
 * for the same reason as {@link Camel}: {@link ScopedBindings} names them, so the
 * public surface cannot be described without them.
 *
 * @public
 */
export type InDomain<T extends CapabilityToken> = Exclude<Reachable<T>, { domain: "" }>;

/**
 * @see {@link InDomain}
 *
 * @public
 */
export type AtRoot<T extends CapabilityToken> = Extract<Reachable<T>, { domain: "" }>;

/**
 * The client `T`'s reach admits: each domain keeps only the methods those tokens
 * can call, and a domain no token reaches is absent entirely.
 *
 * @public
 */
export type ScopedBindings<T extends CapabilityToken> = {
  readonly [D in InDomain<T>["domain"] as Camel<D>]: Camel<D> extends keyof PublicBindings
    ? Pick<
        PublicBindings[Camel<D>],
        Extract<InDomain<T>, { domain: D }>["method"] & keyof PublicBindings[Camel<D>]
      >
    : never;
} & Pick<PublicBindings, AtRoot<T>["method"] & keyof PublicBindings>;

/** The tokens a published profile stands for, as a type. */
export type ProfileTokens<P extends ProfileName> = (typeof PROFILES)[P][number];

/**
 * A client scoped to a profile — what `connection.scoped('surface.…')` returns.
 *
 * @public
 */
export type ProfileScopedBindings<P extends ProfileName> = ScopedBindings<ProfileTokens<P>>;
