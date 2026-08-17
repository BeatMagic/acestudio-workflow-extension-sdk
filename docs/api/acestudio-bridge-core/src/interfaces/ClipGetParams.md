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

Stable clip UUID, with braces, as `clip list` reports it. The only form that reaches a clip in the pinned Video or Marker band.

***

### preferredTimeUnit?

```ts
optional preferredTimeUnit?: string;
```

Time unit for returned geometry values: `default`, `tick`, or `second`. Defaults to `default` (the pattern's native unit).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

Track index (0-based) in the arrangement. Pair with `clipIndex`.
