# Interface: SoundSourceSetParams

Arguments for `sound-source set`.

## Properties

### member?

```ts
optional member?: number;
```

Which member to retarget on a choir or ensemble track. `0` is the leader. Omit to set the model for the whole source, which on a single-voice track is the only thing there is to set.

***

### model

```ts
model: string;
```

**Required.** Which vocal synth model to sing through, by model name (`Verse24`) or by generation (`v1`, `v2`). A generation picks that generation's recommended model for this voice. A name that names no model is an error; nothing is substituted, so a typo surfaces here rather than as a track that quietly sings through something else.

***

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
