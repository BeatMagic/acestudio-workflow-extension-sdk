# Interface: GenerativeVoiceChangeParams

Arguments for `generative voice-change`.

## Properties

### correctToKey?

```ts
optional correctToKey?: string | null;
```

Snap the converted pitch to a key, e.g. `C` or `F#`. Passing this enables scale correction, which is off unless asked for; omit it and `--correct-to-scale` has nothing to apply to.

***

### correctToScale?

```ts
optional correctToScale?: string | null;
```

Which scale in that key, e.g. `Major` (the default) or `Minor`. `--correct-to-key` only.

***

### from

```ts
from: number;
```

Where the converted range starts.

***

### modelIds

```ts
modelIds: number[];
```

A Voice Changer model to re-sing in, by its numeric id. Repeatable; at least one is required. Each model's output lands on a new track of its own.

These are **Voice Changer models**, a catalog of their own -- not the singing voices `voice list` reports, which is why the argument is not spelled `--voice-id`. The ids come from the Voice Changer panel's model list; no CLI verb enumerates them yet.

Several models per launch is the point of the feature: the caller is asking to audition choices. It is also the cheap shape -- the source range is rendered **once** and that one render feeds every model, so four voices cost one render rather than four. The launch is therefore one job carrying one result per model, each settling on its own (ADR 0084).

***

### pitchCorrection?

```ts
optional pitchCorrection?: number | null;
```

How hard to pull the converted pitch onto pitch centers, 0 to 100. Default 20 -- a strength, not an on/off switch, and 0 is the way to turn it off.

***

### randomOffset?

```ts
optional randomOffset?: number | null;
```

How much random variation to allow between takes, 0 to 100. Default 0.

***

### removeInstrument?

```ts
optional removeInstrument?: boolean | null;
```

Strip the accompaniment out of the source before converting. Off by default; useful when the range carries a full mix rather than an isolated vocal.

***

### removeReverb?

```ts
optional removeReverb?: boolean | null;
```

Strip reverb out of the source before converting. Off by default.

***

### semitones?

```ts
optional semitones?: number | null;
```

Transpose the converted take, -24 to 24 semitones. Default 0. Applies to every requested model -- a per-model transposition is a panel affordance that would need a different argument shape, and is not exposed.

***

### to

```ts
to: number;
```

Where the converted range ends (exclusive).

***

### trackUuids

```ts
trackUuids: string[];
```

A track whose audio feeds the conversion, by id. Repeatable; at least one is required. Several tracks are summed into the one take that gets re-sung, matching what the panel does with a multi-track selection.
