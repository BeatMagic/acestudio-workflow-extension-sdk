# Interface: BlendAddParams

Arguments for `blend add`.

## Properties

### at?

```ts
optional at?: number;
```

Where to insert the seed. Defaults to the end of the recipe.

***

### blend?

```ts
optional blend?: string;
```

Which blend, by display name or ref. A name matching more than one blend is an error listing the candidates. Give this or a track target, never both and never neither.

***

### link?

```ts
optional link?: boolean;
```

Whether Style should follow Timbre for this seed.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track carrying a voice mix, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would edit an unrelated track (ADR 0129 §2).

***

### seed

```ts
seed: string;
```

**Required.** Which voice seed to add, by seed name or ref. Use `voice seeds --model \<name\>` to see what the blend's model allows.

***

### style?

```ts
optional style?: number;
```

Style weight for the new seed, 0 to 1. Defaults to 0.2. An error on a timbre-only model, which has no Style axis.

***

### timbre?

```ts
optional timbre?: number;
```

Timbre weight for the new seed, 0 to 1. Defaults to 0.2, matching the app: a seed you add is an alteration to the blend's base voice, not an equal partner in it.

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
