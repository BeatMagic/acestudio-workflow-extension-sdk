# Interface: SoundSourceLoadParams

Arguments for `sound-source load`.

## Properties

### format?

```ts
optional format?: "vst3" | "vst2" | "au";
```

Plugin format for an external instrument. One plugin commonly ships in several; the format picks which build gets mounted.

***

### model?

```ts
optional model?: string;
```

Which vocal synth model to sing through, by model name or by generation (`v1`, `v2`). Omit to take what the app would have picked.

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

**Required.** Which sound source to load, by display name or by `ref`. A name that matches exactly one source loads it. A name that matches several is an error listing the candidates with their refs, and passing one of those refs back resolves it. A ref is always accepted directly, so a script never has to trigger the error to learn the syntax.

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

***

### vendor?

```ts
optional vendor?: string;
```

Narrow an ambiguous external-instrument name by plugin vendor. Two vendors shipping a plugin of the same name is ordinary; this is the first thing to reach for before falling back to a ref.
