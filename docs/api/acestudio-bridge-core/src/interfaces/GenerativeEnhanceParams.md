# Interface: GenerativeEnhanceParams

Arguments for `generative enhance`.

## Properties

### clipUuid?

```ts
optional clipUuid?: string;
```

An audio clip already in the project to enhance, by id as `clip list` reports it. Its audio is uploaded as-is — this does not render the project.

***

### influence?

```ts
optional influence?: number;
```

How strongly `prompt` overrides what the source suggests, 0.0 to 1.0. Default 0.0: follow the source.

***

### lyrics?

```ts
optional lyrics?: string;
```

Lyrics for the new take. Omit to keep the lyrics the analysis transcribed out of the source audio.

***

### path?

```ts
optional path?: string;
```

Audio file to enhance. Exactly one of `path` / `clipUuid` is required.

***

### prompt?

```ts
optional prompt?: string;
```

Style to produce ("acoustic, brushed drums, intimate"). Omit to keep the style tags the analysis inferred from the source.

***

### title?

```ts
optional title?: string;
```

Title for the generated take. Omit for the derived one, as in `generative song`.
