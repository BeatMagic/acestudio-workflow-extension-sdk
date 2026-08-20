# Interface: ClipGetParams

Arguments for `clip get`.

## Properties

### clipIndex?

```ts
optional clipIndex?: number;
```

Clip index within the track (0-based, chronological order). Pair with `trackIndex`.

***

### clipUuid?

```ts
optional clipUuid?: string;
```

Stable clip UUID, with braces, as `clip list` reports it.

***

### preferredTimeUnit?

```ts
optional preferredTimeUnit?: string;
```

Time unit for the DEPRECATED `geometry.pos`/`dur`/... fields: `default`, `tick`, or `second`. Defaults to `default` (the pattern's native unit). DEPRECATED: the `*Tick` and `*Sec` pairs are both always populated, so there is nothing left to prefer. Still honoured for the legacy fields.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video`, `marker`, or `chord`. The regions are isolated index spaces (ADR 0104), so an index read against the wrong one names an unrelated track (ADR 0129 §1).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

Track position (0-based) in `region`. Pair with `clipIndex`.
