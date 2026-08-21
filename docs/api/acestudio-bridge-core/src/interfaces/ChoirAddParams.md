# Interface: ChoirAddParams

Arguments for `choir add`.

## Properties

### at?

```ts
optional at?: number;
```

Where to insert the new member. Omit for the end. `0` makes the new voice the leader and pushes the rest down.

***

### model?

```ts
optional model?: string;
```

Which vocal synth model the new member sings through, by model name or generation. Omit for the voice's default.

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

Which voice to add, by display name or ref — the same thing `sound-source load --source` accepts, including a blended voice.

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
