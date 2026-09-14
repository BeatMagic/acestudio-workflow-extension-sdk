# Interface: FxInsertChainParams

Arguments for `fx insert-chain`.

## Properties

### at?

```ts
optional at?: number;
```

0-based slot the saved chain's first insert lands at; the rest follow it in signal order, and the inserts already there from that slot on move down. Omit it to append at the end of the chain. A slot past the end appends.

***

### preset

```ts
preset: string;
```

The saved chain to insert, by its path in the library, as `list-chains` reports it: `Vocal/Warm Stack`, or a bare name at the root — `Singer` for one that ships with Studio.

***

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see `Fx.acerpc`.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video` or `marker`. The regions are isolated index spaces (ADR 0104), so an index read against the wrong one names an unrelated track (ADR 0129 §1). Ignored beside `trackUuid`, which needs no region.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, or `master` for the master bus. The definitive handle: it works in every region, where an index needs `region` to be read.
