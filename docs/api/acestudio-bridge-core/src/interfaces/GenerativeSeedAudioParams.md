# Interface: GenerativeSeedAudioParams

Arguments for `generative seed-audio`.

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

What to generate. Required.

***

### referenceAudio?

```ts
optional referenceAudio?: string[] | null;
```

A local audio file to reference. Repeatable.

***

### referenceImage?

```ts
optional referenceImage?: string | null;
```

A local image whose mood the generation should follow -- the panel's reference-image slot.

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
