# Interface: BlendCreateParams

Arguments for `blend create`.

## Properties

### avatar?

```ts
optional avatar?: number;
```

Avatar id. Omit to fall back to the first seed's avatar.

***

### language?

```ts
optional language?: string;
```

The blend's native language, as a full English name. Omit to take the first one the model and seeds allow.

***

### model

```ts
model: string;
```

**Required.** Which vocal synth model the blend sings through, by model name or generation. Fixed for the life of the blend: it decides which seeds are available, which languages the blend can sing, and whether the Style axis exists at all.

***

### name

```ts
name: string;
```

**Required.** Display name for the new blend.

***

### tags?

```ts
optional tags?: string[];
```

Tag names to attach, for filtering in `sound-source list`.
