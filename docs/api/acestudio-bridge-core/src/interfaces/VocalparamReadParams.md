# Interface: VocalparamReadParams

Arguments for `vocalparam read`.

## Properties

### category

```ts
category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

Which vocal characteristic a curve controls. Spellings follow the vocal-control UI's own face names: `pitch` is the melodic line as a delta in semitones, `energy` the loudness/effort curve, `tension` the vocal strain, `air` the breathiness, `falsetto` the head-voice mix, and `formant` the gender channel. Two of the UI's faces are deliberately absent, because neither is a curve: its "Breath" face places breath *marks* (the `breath` group) and its "Pronounce" face edits phoneme timing (the `lyric` group). Every category is addressable, but not every category exists on every clip: which ones do depends on the singer's engine generation, and `vocalparam layers` reports that as an availability matrix rather than by omitting a row.

***

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form).

***

### encoding?

```ts
optional encoding?: "base64" | "json";
```

Wire encoding of a point payload. `json` is the default: points travel as a plain array of numbers with `null` at a gap, which costs nothing to read with `jq` and keeps a curve inspectable without tooling. `base64` travels as the self-describing little-endian envelope (see `PointsEnvelope`), a gap a NaN bit pattern — bit-exact and compact, which is what a long curve wants.

***

### layer?

```ts
optional layer?: "direct" | "baseline" | "user" | "envelope" | "effective";
```

One layer of a parameter's curve stack, including the merged result. A vocal parameter is not one curve: it is a stack the engine merges. `baseline` is what the engine produced unprompted (the model's analyzed curve, or the generation's synthesized default) and is read-only, because it shifts with every re-render. `user` and `direct` are drawn overrides that win wherever they carry a value and are undrawn elsewhere. `envelope` is a multiplier over what lies under it. `effective` is the merged curve the synth actually consumes: engine-computed, always readable, never writable — never reconstruct it from the layers. Which of these a given (generation x category) has is a host fact, not a property of this roster: `vocalparam layers` reports the matrix, and `effective` exists for every available category.

***

### rangeBegin?

```ts
optional rangeBegin?: number;
```

First clip-local tick to read. Defaults to the clip's visible start.

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

Clip-local tick to read up to, exclusive. Defaults to the clip's visible end.
