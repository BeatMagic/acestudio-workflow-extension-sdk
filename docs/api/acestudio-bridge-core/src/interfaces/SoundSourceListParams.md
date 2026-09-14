# Interface: SoundSourceListParams

Arguments for `sound-source list`.

## Properties

### category?

```ts
optional category?: string;
```

Filter AI instruments by category name, such as `Piano`.

***

### keyword?

```ts
optional keyword?: string;
```

Filter by name substring, case-insensitive.

***

### kind?

```ts
optional kind?: ("instrument" | "voice" | "choir" | "ensemble" | "external-instrument")[];
```

Only list sources of these kinds. Omit for everything.

***

### language?

```ts
optional language?: string;
```

Filter by *native* language, as a full English name such as `Japanese` -- the language a source was mainly trained on, and so the one it sings most like a native speaker of. Applies to voices and choirs; other kinds have no language. It does not match `supportedLanguages`. What a source *can* sing is a property of its vocal synth model, not of the source: every voice on a current model sings every language that model ships with, so matching the supported list would return the whole roster and answer nothing. To ask what a source can sing, filter by `model` instead.

***

### model?

```ts
optional model?: string;
```

Only list sources that play through this model: voices whose vocal synth models include it, and AI instruments whose own model carries the name. Takes a model name (`Verse24`), or for voices a generation (`v1`, `v2`), which selects the voices that generation recommends a model for. Kinds with no model never match.

***

### origin?

```ts
optional origin?: ("cloned" | "premade" | "community" | "blended")[];
```

Only list sources from these libraries. Omit for everything.

***

### showRefs?

```ts
optional showRefs?: boolean;
```

Show each source's `ref` in the human listing. Refs are always present in the JSON payload; this is for reading them without first provoking an ambiguity error.

***

### tags?

```ts
optional tags?: string[];
```

Filter by tag name, case-insensitive, matching any of the given tags.

***

### vendor?

```ts
optional vendor?: string;
```

Filter external instruments by plugin vendor.
