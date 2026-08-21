# Interface: BlendSetParams

Arguments for `blend set`.

## Properties

### avatar?

```ts
optional avatar?: number;
```

New avatar id. Blend-level.

***

### blend?

```ts
optional blend?: string;
```

Which blend, by display name or ref. A name matching more than one blend is an error listing the candidates. Give this or a track target, never both and never neither.

***

### language?

```ts
optional language?: string;
```

New native language, as a full English name. Must be one the model and seeds allow. Blend-level.

***

### link?

```ts
optional link?: boolean;
```

Whether Style should follow Timbre for this seed. Requires `member`.

***

### member?

```ts
optional member?: number;
```

Which seed to configure, by 0-based position in the recipe. Omit to configure the blend itself instead.

***

### name?

```ts
optional name?: string;
```

New display name. Blend-level.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track carrying a voice mix, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would edit an unrelated track (ADR 0129 §2).

***

### style?

```ts
optional style?: number;
```

This seed's Style weight, 0 to 1. Requires `member`, and requires a model that has a Style axis: on a timbre-only model this is an error rather than a value that silently does nothing.

***

### tags?

```ts
optional tags?: string[];
```

Replacement tag list. Replaces the existing tags rather than adding to them. Blend-level.

***

### timbre?

```ts
optional timbre?: number;
```

This seed's Timbre weight, 0 to 1. Requires `member`.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement, naming a track subject the terminal-ergonomic way.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format. Names the live mix on that track as the subject instead of a library entry.
