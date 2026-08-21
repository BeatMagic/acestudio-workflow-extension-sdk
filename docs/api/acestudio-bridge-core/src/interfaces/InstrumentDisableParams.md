# Interface: InstrumentDisableParams

Arguments for `instrument disable`.

## Properties

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track this group operates on, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would act on an unrelated track (ADR 0129 §2).

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
