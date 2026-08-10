# Interface: SoundSourceListParams

Arguments for `sound-source list`.

## Properties

### category?

```ts
optional category?: string | null;
```

Filter AI instruments by category name, such as `Piano`.

***

### keyword?

```ts
optional keyword?: string | null;
```

Filter by name substring, case-insensitive.

***

### kind?

```ts
optional kind?: 
  | ("voice" | "choir" | "instrument" | "ensemble" | "external-instrument")[]
  | null;
```

Only list sources of this kind. Repeatable, so `--kind voice --kind choir` gives you both. Omit for everything.

***

### language?

```ts
optional language?: string | null;
```

Filter by language, as a full English name such as `Japanese`. Applies to voices and choirs; other kinds have no language.

***

### model?

```ts
optional model?: string | null;
```

Only list voices that work with this vocal synth model. Takes either a model name (`Verse24`) or a generation (`v1`, `v2`), and a generation selects the voices that generation recommends a model for.

***

### origin?

```ts
optional origin?: ("premade" | "cloned" | "community" | "blended")[] | null;
```

Only list sources from this library. Repeatable. Omit for everything.

***

### showRefs?

```ts
optional showRefs?: boolean | null;
```

Show each source's `ref` in the human listing. Refs are always present in the JSON payload; this is for reading them without first provoking an ambiguity error.

***

### tags?

```ts
optional tags?: string[] | null;
```

Filter by tag name, case-insensitive, matching any of the given tags.

***

### vendor?

```ts
optional vendor?: string | null;
```

Filter external instruments by plugin vendor.
