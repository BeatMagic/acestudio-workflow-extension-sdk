# Interface: SoundSourceSetParams

Arguments for `sound-source set`.

## Properties

### member?

```ts
optional member?: number | null;
```

Which member to retarget on a choir or ensemble track. `0` is the leader. Omit to set the model for the whole source, which on a single-voice track is the only thing there is to set.

***

### model

```ts
model: string;
```

**Required.** Which vocal synth model to sing through, by model name (`Verse24`) or by generation (`v1`, `v2`). A generation picks that generation's recommended model for this voice.

A name that names no model is an error; nothing is substituted, so a typo surfaces here rather than as a track that quietly sings through something else.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format.
