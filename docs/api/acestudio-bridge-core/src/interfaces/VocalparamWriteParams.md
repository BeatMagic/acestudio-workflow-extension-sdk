# Interface: VocalparamWriteParams

Arguments for `vocalparam write`.

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

### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope";
```

A layer `vocalparam write` may target: `ParamLayerName` minus `effective`. `effective` is the merged curve and is never writable (ADR 0085) — the merge rule is engine-owned, and a consumer that could write the merged result would be reimplementing it. Sharing one layer roster with the read side would make a write's schema advertise a value the host always refuses, which is a type that lies about what the operation accepts; so the write side declares its own roster and the value is refused at decode rather than by a handler branch. The roster is still not the availability: `vocalparam layers` marks which of these this clip's generation actually lets you write.

***

### points

```ts
points: unknown;
```

The replacement values, one per clip-local tick from `posBegin`. Same dual shape as `ParamLayer.points`, chosen by the sibling `encoding` argument: a plain array under `json` (`null` clears a tick to undrawn), or a `PointsEnvelope` under `base64` — whose declared `count` must match its decoded byte length, or the write is rejected.

***

### posBegin

```ts
posBegin: number;
```

Clip-local tick the written span starts at — element 0 of `points` lands here. Pass back the `posBegin` from the read you transformed.
