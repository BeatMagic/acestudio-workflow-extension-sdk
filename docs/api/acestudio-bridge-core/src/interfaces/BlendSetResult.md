# Interface: BlendSetResult

Success payload of `blend set`.

## Properties

### avatar?

```ts
optional avatar?: number;
```

Avatar id, or -1 when the blend falls back to its first seed's avatar.

***

### group

```ts
group: string;
```

Group discriminator of the blended-voice library this blend belongs to.

***

### id

```ts
id: number;
```

The blend's library id.

***

### language?

```ts
optional language?: string;
```

Full English name of the blend's native language.

***

### modelId

```ts
modelId: number;
```

Id of the vocal synth model the blend sings through. Fixed when the blend was created.

***

### modelName

```ts
modelName: string;
```

Name of that model.

***

### name

```ts
name: string;
```

Display name.

***

### ref

```ts
ref: string;
```

Ref for this blend, accepted by `--blend` here and by `sound-source load --source`.

***

### seedCount

```ts
seedCount: number;
```

How many seeds the recipe holds.

***

### seeds

```ts
seeds: {
  code: number;
  index: number;
  link: boolean;
  name?: string;
  style?: number;
  timbre: number;
}[];
```

The recipe, in order.

#### code

```ts
code: number;
```

The voice seed's code.

#### index

```ts
index: number;
```

0-based position in the recipe, which is what `blend set --member` and `blend remove --member` address.

#### link

```ts
link: boolean;
```

Whether Style follows Timbre for this seed. The UI shows this as the link between the two sliders.

#### name?

```ts
optional name?: string;
```

The seed's display name. Absent when the seed is no longer in the local registry, which can happen to a blend saved against a voice you no longer have.

#### style?

```ts
optional style?: number;
```

This seed's Style weight, 0 to 1. Absent on a timbre-only model, which has no Style axis at all.

#### timbre

```ts
timbre: number;
```

This seed's Timbre weight, 0 to 1. The UI calls this Timbre.

***

### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Every language this blend can sing, which is what its model and seeds allow between them.

***

### tags?

```ts
optional tags?: string[];
```

Tag names attached to the blend.

***

### timbreOnly?

```ts
optional timbreOnly?: boolean;
```

True when the model carries no Style axis. Seeds on such a blend report no `style`, and passing `--style` is an error rather than a value that quietly does nothing.
