# Interface: GenerativeVoiceChangeParams

Arguments for `generative voice-change`.

## Properties

### correctToKey?

```ts
optional correctToKey?: string;
```

Snap the converted pitch to a key, e.g. "C" or "F#". Passing this enables scale correction, which is off unless asked for.

***

### correctToScale?

```ts
optional correctToScale?: string;
```

Which scale in that key, e.g. "Major" (the default) or "Minor". **`correctToKey` only**.

***

### from

```ts
from: number;
```

Where the converted range starts, in ticks.

***

### modelIds

```ts
modelIds: number[];
```

Voice Changer models to re-sing in, by numeric id. At least one is required; each model's output lands on a new track of its own. These are Voice Changer models, not the singing voices `voice list` reports.

***

### pitchCorrection?

```ts
optional pitchCorrection?: number;
```

How hard to pull the converted pitch onto pitch centers, 0 to 100. Default 20 — a strength, not a switch; 0 turns it off.

***

### randomOffset?

```ts
optional randomOffset?: number;
```

How much random variation to allow between takes, 0 to 100. Default 0.

***

### removeInstrument?

```ts
optional removeInstrument?: boolean;
```

Strip the accompaniment out of the source before converting. Off by default.

***

### removeReverb?

```ts
optional removeReverb?: boolean;
```

Strip reverb out of the source before converting. Off by default.

***

### semitones?

```ts
optional semitones?: number;
```

Transpose the converted take, -24 to 24 semitones. Default 0. Applies to every requested model.

***

### to

```ts
to: number;
```

Where the converted range ends (exclusive), in ticks.

***

### trackUuids

```ts
trackUuids: string[];
```

Tracks whose audio feeds the conversion, by id. At least one is required; several are summed into the one take that gets re-sung.
