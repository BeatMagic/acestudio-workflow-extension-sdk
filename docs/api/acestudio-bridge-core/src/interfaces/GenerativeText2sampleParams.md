# Interface: GenerativeText2sampleParams

Arguments for `generative text2sample`.

## Properties

### from

```ts
from: number;
```

Where the generated clip starts. Ticks (`3840t`), clock time (`1.5s`), or a musical position (`4.1.0`).

***

### prompt

```ts
prompt: string;
```

What to generate ("warm analog pad, slow attack"). Required.

***

### referenceAudio?

```ts
optional referenceAudio?: string | null;
```

A local audio file whose character the generation should follow.

***

### soundHint?

```ts
optional soundHint?: string | null;
```

A sound category to steer the model, from the panel's Sounds picker ("Pad", "Pluck"). One hint, not a list — the producer carries a single `soundHint` string (`AiPluginTaskText2SampleAttempt::setSoundHint`).

***

### to

```ts
to: number;
```

Where the generated clip ends (exclusive). This is what fixes the generation's length.

***

### trackUuid

```ts
trackUuid: string;
```

The Audio track the generated clip lands on, by id. Required: the panel takes it from the arrangement selection, which is not something a script can rely on (ADR 0087). Its content in the range is moved aside the same way the panel's own launch moves it, as one undo entry.
