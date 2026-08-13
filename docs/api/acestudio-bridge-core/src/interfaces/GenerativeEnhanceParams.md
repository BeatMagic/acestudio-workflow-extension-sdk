# Interface: GenerativeEnhanceParams

Arguments for `generative enhance`.

## Properties

### clipUuid?

```ts
optional clipUuid?: string | null;
```

An audio clip already in the project to enhance, by id as `clip list` reports it. Its audio is uploaded as-is -- this does not render the project, so what the clip carries is what gets analyzed.

***

### influence?

```ts
optional influence?: number | null;
```

How strongly `--prompt` overrides what the source suggests, 0.0 to 1.0. Default 0.0, the panel's own default: follow the source.

***

### lyrics?

```ts
optional lyrics?: string | null;
```

Lyrics for the new take. Omit to keep the lyrics the analysis transcribed out of the source audio.

***

### path?

```ts
optional path?: string | null;
```

Audio file to enhance. Exactly one of `--path` / `--clip-uuid` is required.

***

### prompt?

```ts
optional prompt?: string | null;
```

Style to produce ("acoustic, brushed drums, intimate"). Omit to keep the style tags the analysis inferred from the source.

***

### title?

```ts
optional title?: string | null;
```

Title for the generated take. Omit for the derived one, as in `generative song`.
