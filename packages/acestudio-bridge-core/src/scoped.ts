/**
 * The capability facade: a client typed down to the reach of a set of tokens.
 *
 * @remarks
 * This narrows types; it does not enforce anything. What refuses an ungranted
 * call is the pre-wire `grant` check inside each bound method in `bindings.ts`,
 * and that check rides in the method's own closure — so a facade may hand back
 * the same client, a copy of it, or a merge of several surfaces without any of
 * those weakening it. You cannot escape a guard by moving the reference that
 * carries it.
 *
 * `connection.scoped(...)` returns the *same* object because it narrows a single
 * client and nothing more is called for there. That is an economy of this case,
 * not a rule: a facade that has to span more than one surface must build
 * something, and building it costs correctness nothing.
 *
 * It reads the generated tables as types, which is why they are emitted
 * `as const` — an annotated `Record<string, CapabilityToken>` would have erased
 * exactly the fact each lookup needs.
 */

import {
  OPERATIONS,
  PROFILES,
  type CapabilityToken,
  type OperationDescriptor,
  type PublicBindings,
} from "./generated/bindings.js";
import type { ProfileName } from "./grant.js";

/**
 * One row of *this* artifact's generated operation table, with its literal types
 * intact.
 *
 * @public
 */
export type Descriptor = (typeof OPERATIONS)[number];

/**
 * Turns `special-tracks` into `specialTracks`: the canonical tree hyphenates a
 * multi-word domain and the binding surface camelCases it. The runtime
 * counterpart is `domainKey()` in `bindings.ts`; the two have to agree, and the
 * `keyof` constraints below are what notices if they stop.
 *
 * Exported because {@link ScopedBindingsOf} is written in terms of it, and a
 * recursive conditional type cannot be inlined into the mapped type that uses it.
 *
 * @public
 */
export type Camel<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}${Capitalize<Camel<Tail>>}`
  : S;

/**
 * The rows of `Rows` a session holding `T` can reach: everything it has the token
 * for, plus every ungated operation — a registry-declared pure function is
 * reachable by any session, including one granted nothing at all.
 *
 * @public
 */
export type ReachableIn<Rows extends OperationDescriptor, T extends string> = Extract<
  Rows,
  { ungated: true } | { capability: T }
>;

/**
 * The reachable rows that nest under a domain — the ones that become
 * `client.clip.list()` rather than a method on the client itself.
 *
 * @public
 */
export type InDomainOf<Rows extends OperationDescriptor, T extends string> = Exclude<
  ReachableIn<Rows, T>,
  { domain: "" }
>;

/**
 * The other half of {@link InDomainOf}: reachable rows declared with no domain,
 * which land on the client itself rather than under a group.
 *
 * Every operation in the current catalogue has a domain, so this resolves to `never`
 * and contributes nothing to a scoped client today. It is the half of the split that
 * keeps {@link ScopedBindingsOf} correct if a domain-less operation is ever
 * published, instead of quietly dropping it.
 *
 * @public
 */
export type AtRootOf<Rows extends OperationDescriptor, T extends string> = Extract<
  ReachableIn<Rows, T>,
  { domain: "" }
>;

/**
 * What the bindings `B` admit for the tokens `T`, given the table `Rows` that
 * describes them: each domain keeps only the methods those tokens can call, and a
 * domain no token reaches is absent entirely.
 *
 * Takes its table and bindings as parameters rather than reading this artifact's,
 * because a profile's reach is not confined to one artifact: one profile's tokens
 * can gate operations published here and operations a first-party artifact
 * declares, and a facade able to see only one of them would report the other half
 * as ungranted. `Rows` and `B` must describe the same surface — pass a table with
 * bindings it does not build and every domain resolves to `never`.
 *
 * @public
 */
export type ScopedBindingsOf<Rows extends OperationDescriptor, B, T extends string> = {
  readonly [D in InDomainOf<Rows, T>["domain"] as Camel<D>]: Camel<D> extends keyof B
    ? Pick<
        B[Camel<D>],
        Extract<InDomainOf<Rows, T>, { domain: D }>["method"] & keyof B[Camel<D>]
      >
    : never;
} & Pick<B, AtRootOf<Rows, T>["method"] & keyof B>;

/**
 * The operations this artifact's own table admits for `T`.
 *
 * @public
 */
export type Reachable<T extends CapabilityToken> = ReachableIn<Descriptor, T>;

/**
 * {@link InDomainOf} over this artifact's own table.
 *
 * @public
 */
export type InDomain<T extends CapabilityToken> = InDomainOf<Descriptor, T>;

/**
 * {@link AtRootOf} over this artifact's own table.
 *
 * @public
 */
export type AtRoot<T extends CapabilityToken> = AtRootOf<Descriptor, T>;

/**
 * The client `T`'s reach admits over this artifact's published surface — what
 * `connection.scoped(...)` returns here.
 *
 * @public
 */
export type ScopedBindings<T extends CapabilityToken> = ScopedBindingsOf<
  Descriptor,
  PublicBindings,
  T
>;

/**
 * The tokens a profile stands for, as a type.
 *
 * Reads the profile table as a type, so it needs one emitted `as const`. A table
 * that carries its record type as an annotation instead answers every lookup with
 * the whole capability-token union rather than the tokens that profile stands for,
 * which would scope every facade to everything.
 *
 * @public
 */
export type TokensOfProfile<
  Profiles extends Readonly<Record<string, readonly string[]>>,
  P extends keyof Profiles,
> = Profiles[P][number];

/** The tokens a published profile of this artifact stands for, as a type. */
export type ProfileTokens<P extends ProfileName> = TokensOfProfile<typeof PROFILES, P>;

/**
 * A client scoped to a profile — what `connection.scoped('surface.…')` returns.
 *
 * @public
 */
export type ProfileScopedBindings<P extends ProfileName> = ScopedBindings<ProfileTokens<P>>;
