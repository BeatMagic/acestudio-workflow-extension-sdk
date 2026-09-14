# Interface: GenerativeMusicEnhancerParams

Arguments for `generative music-enhancer`.

## Properties

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

Title for the generated take. Omit for the derived one, as in `generative inspire-me`.
