# Interface: GenerativeText2sampleParams

Arguments for `generative text2sample`.

## Properties

### from

```ts
from: number;
```

Where the generated clip starts, in ticks.

***

### prompt

```ts
prompt: string;
```

What to generate ("warm analog pad, slow attack"). Required.

***

### referenceAudio?

```ts
optional referenceAudio?: string;
```

A local audio file whose character the generation should follow.

***

### soundHint?

```ts
optional soundHint?: string;
```

A sound category to steer the model, from the panel's Sounds picker ("Pad", "Pluck"). One hint, not a list.

***

### to

```ts
to: number;
```

Where the generated clip ends (exclusive), in ticks. This is what fixes the generation's length.

***

### trackUuid

```ts
trackUuid: string;
```

The Audio track the generated clip lands on, by id. Its content in the range is moved aside as one undo entry.
