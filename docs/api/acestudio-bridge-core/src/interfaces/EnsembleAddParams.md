# Interface: EnsembleAddParams

Arguments for `ensemble add`.

## Properties

### at?

```ts
optional at?: number;
```

Where to insert the new member. Omit for the end. `0` makes the new instrument the leader and pushes the rest down.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track this group operates on, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would act on an unrelated track (ADR 0129 §2).

***

### source

```ts
source: string;
```

Which instrument to add, by display name or ref — the same thing `sound-source load --source` accepts.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format.
