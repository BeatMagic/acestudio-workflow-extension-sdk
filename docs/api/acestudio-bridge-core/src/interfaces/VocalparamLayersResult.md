# Interface: VocalparamLayersResult

Success payload of `vocalparam layers`.

## Properties

### categories

```ts
categories: {
  available: boolean;
  category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
  layers: {
     access: "read-only" | "read-write";
     layer: "direct" | "baseline" | "user" | "envelope" | "effective";
     role: string;
     sparse: boolean;
  }[];
  scale?: string;
  unavailableReason?: string;
  valueRange?: {
     max?: number;
     min?: number;
  };
}[];
```

One row per parameter category, in canonical order. A category this generation does not support is present with an empty `layers` list, so the matrix stays a full grid rather than a set a consumer has to diff.

#### available

```ts
available: boolean;
```

False when the category cannot be read or written on this clip — either the engine generation has no such parameter, or this surface does not carry it yet. `layers` is then empty and `unavailableReason` says why.

#### category

```ts
category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

Which vocal characteristic a curve controls. Spellings follow the vocal-control UI's own face names: `pitch` is the melodic line as a delta in semitones, `energy` the loudness/effort curve, `tension` the vocal strain, `air` the breathiness, `falsetto` the head-voice mix, and `formant` the gender channel. Two of the UI's faces are deliberately absent, because neither is a curve: its "Breath" face places breath *marks* (the `breath` group) and its "Pronounce" face edits phoneme timing (the `lyric` group). Every category is addressable, but not every category exists on every clip: which ones do depends on the singer's engine generation, and `vocalparam layers` reports that as an availability matrix rather than by omitting a row.

#### layers

```ts
layers: {
  access: "read-only" | "read-write";
  layer: "direct" | "baseline" | "user" | "envelope" | "effective";
  role: string;
  sparse: boolean;
}[];
```

The layers this (generation x category) has, merge order first. `effective` is not listed here: it exists for every available category and is what `vocalparam read` returns beside the layers.

#### scale?

```ts
optional scale?: string;
```

Which value space the numbers live in: `model` is SingingMamba's [0,1] model scale, `envelope` is Verse24's multiplier space, `semitones` is pitch delta. Never conflate them (ADR 0073 §3).

#### unavailableReason?

```ts
optional unavailableReason?: string;
```

Present only when `available` is false: why the category cannot be used here, in one sentence.

#### valueRange?

```ts
optional valueRange?: {
  max?: number;
  min?: number;
};
```

Inclusive bounds of a legal value in a category's scale.

##### valueRange.max?

```ts
optional max?: number;
```

##### valueRange.min?

```ts
optional min?: number;
```

***

### categoryCount

```ts
categoryCount: number;
```

Number of entries in `categories` (convenience field).

***

### clipUuid

```ts
clipUuid: string;
```

The clip the matrix describes.

***

### engineGeneration

```ts
engineGeneration: string;
```

The clip's singer engine generation, which is half of what decides layer availability.
