# Interface: FxGetParamsParams

Arguments for `fx get-params`.

## Properties

### filter?

```ts
optional filter?: string;
```

Keep only parameters whose display name or `paramId` matches. A glob by default, matched case-insensitively against the whole string.

***

### insert?

```ts
optional insert?: string;
```

Instance id of the insert, as `fx list` reports it.

***

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see the header.

***

### regex?

```ts
optional regex?: boolean;
```

Read `filter` as a regular expression instead of a glob.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video` or `marker`. The regions are isolated index spaces (ADR 0104), so an index read against the wrong one names an unrelated track (ADR 0129 §1). Ignored beside `trackUuid`, which needs no region.

***

### slot?

```ts
optional slot?: number;
```

0-based slot in the chain. Mutually exclusive with `insert`.

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
