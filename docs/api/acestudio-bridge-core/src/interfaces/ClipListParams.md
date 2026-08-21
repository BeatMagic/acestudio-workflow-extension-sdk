# Interface: ClipListParams

Arguments for `clip list`.

## Properties

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

Track position (0-based) in `region`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format. The definitive handle: it names a track in every region, where an index needs `region` to be read.
