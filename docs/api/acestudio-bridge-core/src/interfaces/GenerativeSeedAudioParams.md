# Interface: GenerativeSeedAudioParams

Arguments for `generative seed-audio`.

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

What to generate. Required.

***

### referenceAudio?

```ts
optional referenceAudio?: string[];
```

Local audio files to reference.

***

### referenceImage?

```ts
optional referenceImage?: string;
```

A local image whose mood the generation should follow.

***

### to

```ts
to: number;
```

Where the generated clip ends (exclusive), in ticks.

***

### trackUuid

```ts
trackUuid: string;
```

The Audio track the generated clip lands on, by id.
