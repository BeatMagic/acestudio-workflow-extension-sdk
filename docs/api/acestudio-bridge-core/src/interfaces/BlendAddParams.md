# Interface: BlendAddParams

Arguments for `blend add`.

## Properties

### at?

```ts
optional at?: number;
```

Where to insert the seed. Defaults to the end of the recipe.

***

### blend

```ts
blend: string;
```

**Required.** Which blend to add to, by display name or ref.

***

### link?

```ts
optional link?: boolean;
```

Whether Style should follow Timbre for this seed.

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
