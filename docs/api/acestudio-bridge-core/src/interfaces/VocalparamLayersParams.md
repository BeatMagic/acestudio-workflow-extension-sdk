# Interface: VocalparamLayersParams

Arguments for `vocalparam layers`.

## Properties

### category?

```ts
optional category?: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

Which vocal characteristic a curve controls. Spellings follow the vocal-control UI's own face names: `pitch` is the melodic line as a delta in semitones, `energy` the loudness/effort curve, `tension` the vocal strain, `air` the breathiness, `falsetto` the head-voice mix, and `formant` the gender channel. Two of the UI's faces are deliberately absent, because neither is a curve: its "Breath" face places breath *marks* (the `breath` group) and its "Pronounce" face edits phoneme timing (the `lyric` group). Every category is addressable, but not every category exists on every clip: which ones do depends on the singer's engine generation, and `vocalparam layers` reports that as an availability matrix rather than by omitting a row.

***

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form).
