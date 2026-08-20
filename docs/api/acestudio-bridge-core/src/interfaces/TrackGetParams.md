# Interface: TrackGetParams

Arguments for `track get`.

## Properties

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video`, `marker`, or `chord`. The regions are isolated index spaces (ADR 0104), so an index read against the wrong one names an unrelated track. Ignored beside `trackUuid`, which needs no region.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region` (users see arrangement tracks numbered from 1). Mutually exclusive with `trackUuid`. An empty arrangement slot is a valid target here and answers with `trackType: "Empty"` — reading is how a caller learns that an index it saw in a listing is padding (ADR 0129 §4). So the range this accepts is every slot the arrangement holds, not only the ones up to its last content track; a write, which cannot take an empty slot, stops at the content range instead.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, or the well-known id `master` for the project's master bus. The definitive handle: it works in every region, where an index needs `region` to be read.
