# Interface: TrackResolveParams

Arguments for `track resolve`.

## Properties

### region?

```ts
optional region?: string;
```

Which index space `trackIndices` count in: `arrangement` (the default), `video`, `marker`, or `chord`. One region for the whole batch — a call spanning two of them is two calls. Does not apply to `trackUuids`, which name a track in any region.

***

### trackIndices?

```ts
optional trackIndices?: number[];
```

0-based positions to resolve, in the index space `region` names. Repeatable.

***

### trackUuids?

```ts
optional trackUuids?: string[];
```

Track UUIDs to resolve, in braces format. Repeatable. Takes `master`, which answers with no index or region because it has neither.
