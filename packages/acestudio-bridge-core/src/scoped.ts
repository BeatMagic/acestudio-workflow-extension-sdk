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
  NOTIFICATION_CHANNELS,
  OPERATIONS,
  PROFILES,
  type CapabilityToken,
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
 * One row of *this* artifact's generated channel table, with its literal types
 * intact.
 *
 * @public
 */
export type ChannelRow = (typeof NOTIFICATION_CHANNELS)[number];

/**
 * Every row of this artifact's tables: what a session can call, and what it can
 * subscribe to.
 *
 * @public
 */
export type ArtifactRow = Descriptor | ChannelRow;

/**
 * What scoping needs from a generated row: the domain it nests under, the member it
 * becomes, and the token that reaches it.
 *
 * A bound rather than a descriptor, and deliberately a small one, because both
 * `OperationDescriptor` and `ChannelDescriptor` have to satisfy it. A profile's reach
 * covers a domain's subscriptions as much as its calls — `canvas.changed` is gated by
 * `canvas.read`, the same token `canvas info` needs — so a facade admitting only
 * operations reports a granted channel as absent. Rows carrying `ungated` are still
 * read for it; a channel declares no such field and so is never ungated, which is
 * correct: there is no unguarded subscription.
 *
 * @public
 */
export interface SurfaceRow {
  /** Domain group the member nests under; empty for a root-level one. */
  readonly domain: string;
  /** The binding member this row becomes — a verb, or a subscription. */
  readonly method: string;
  /** The capability a session needs to reach it. */
  readonly capability: string;
}

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
export type ReachableIn<Rows extends SurfaceRow, T extends string> = Extract<
  Rows,
  { ungated: true } | { capability: T }
>;

/**
 * The reachable rows that nest under a domain — the ones that become
 * `client.clip.list()` rather than a method on the client itself.
 *
 * @public
 */
export type InDomainOf<Rows extends SurfaceRow, T extends string> = Exclude<
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
export type AtRootOf<Rows extends SurfaceRow, T extends string> = Extract<
  ReachableIn<Rows, T>,
  { domain: "" }
>;

/**
 * What the bindings `B` admit for the tokens `T`, given the rows `Rows` that
 * describe them: each domain keeps only the members those tokens reach, and a domain
 * no token reaches is absent entirely.
 *
 * Takes its rows and bindings as parameters rather than reading this artifact's,
 * because a profile's reach is not confined to one artifact or to one kind of row:
 * one profile's tokens can gate operations published here, operations a first-party
 * artifact declares, and the change channels of either. A facade able to see only
 * some of those reports the rest as ungranted. Pass every table whose rows the
 * profile can reach — `Rows` and `B` must describe the same surface, and a table
 * paired with bindings it does not build leaves every domain `never`.
 *
 * @public
 */
export type ScopedBindingsOf<Rows extends SurfaceRow, B, T extends string> = {
  readonly [D in InDomainOf<Rows, T>["domain"] as Camel<D>]: Camel<D> extends keyof B
    ? Pick<
        B[Camel<D>],
        Extract<InDomainOf<Rows, T>, { domain: D }>["method"] & keyof B[Camel<D>]
      >
    : never;
} & Pick<B, AtRootOf<Rows, T>["method"] & keyof B>;

/**
 * What this artifact's own tables admit for `T` — operations and channels alike.
 *
 * @public
 */
export type Reachable<T extends CapabilityToken> = ReachableIn<ArtifactRow, T>;

/**
 * {@link InDomainOf} over this artifact's own tables.
 *
 * @public
 */
export type InDomain<T extends CapabilityToken> = InDomainOf<ArtifactRow, T>;

/**
 * {@link AtRootOf} over this artifact's own tables.
 *
 * @public
 */
export type AtRoot<T extends CapabilityToken> = AtRootOf<ArtifactRow, T>;

/**
 * The client `T`'s reach admits over this artifact's published surface — what
 * `connection.scoped(...)` returns here.
 *
 * Built from both tables, so a domain arrives with the subscriptions `T` reaches
 * beside the calls it reaches. Scoping to `surface.canvas.read` and then having to
 * leave the facade to subscribe to `canvas.changed` — a channel that very token
 * gates — would make the facade an incomplete account of its own profile.
 *
 * @public
 */
export type ScopedBindings<T extends CapabilityToken> = ScopedBindingsOf<
  ArtifactRow,
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
