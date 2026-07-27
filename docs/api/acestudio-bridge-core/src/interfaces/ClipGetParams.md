# Interface: ClipGetParams

Arguments for `clip get`.

## Properties

### clipIndex

```ts
clipIndex: number;
```

Clip index within the track (0-based, chronological order).

***

### preferredTimeUnit?

```ts
optional preferredTimeUnit?: string | null;
```

Time unit for returned geometry values. One of `default`, `tick`, or `second`. Defaults to `default` (pattern's native unit).

***

### trackIndex

```ts
trackIndex: number;
```

Track index (0-based).
