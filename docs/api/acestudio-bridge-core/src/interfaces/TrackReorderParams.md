# Interface: TrackReorderParams

Arguments for `track reorder`.

## Properties

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video`, `marker`, or `chord`. The regions are isolated index spaces (ADR 0104), so an index read against the wrong one names an unrelated track. Ignored beside `trackUuid`, which needs no region.

***

### toIndex

```ts
toIndex: number;
```

0-based position to move to, in the same region the track already lives in. A track cannot leave its region: the pinned Video and Marker bands hold only their own type (ADR 0104).

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

Track UUID in braces format, e.g. `\{12345678-abcd-...\}`. The definitive handle: it works in every region, where an index needs `region` to be read.
