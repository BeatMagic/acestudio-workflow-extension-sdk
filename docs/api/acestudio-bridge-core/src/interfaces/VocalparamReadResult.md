# Interface: VocalparamReadResult

Success payload of `vocalparam read`.

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

The clip read from.

***

### count

```ts
count: number;
```

Elements per layer: one per clip-local tick, so the last covers tick `posBegin + count - 1`.

***

### effective

```ts
effective: {
  access: "read-only" | "read-write";
  drawnRanges?: {
     begin: number;
     end: number;
  }[];
  layer: "direct" | "baseline" | "user" | "envelope" | "effective";
  points: unknown;
  role: string;
  sparse: boolean;
};
```

One layer as `vocalparam read` returns it: its declaration plus the points themselves.

#### access

```ts
access: "read-only" | "read-write";
```

Whether a layer can be written, on this clip's engine generation. The two are exclusive: `read-write` names a layer `vocalparam write` may target, `read-only` one it always refuses. The merged `effective` curve is `read-only` on every generation.

#### drawnRanges?

```ts
optional drawnRanges?: {
  begin: number;
  end: number;
}[];
```

For a sparse layer, the clip-local tick ranges that carry drawn values. Absent on a dense layer. Reading this is cheaper than scanning `points` for gaps.

#### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope" | "effective";
```

One layer of a parameter's curve stack, including the merged result. A vocal parameter is not one curve: it is a stack the engine merges. `baseline` is what the engine produced unprompted (the model's analyzed curve, or the generation's synthesized default) and is read-only, because it shifts with every re-render. `user` and `direct` are drawn overrides that win wherever they carry a value and are undrawn elsewhere. `envelope` is a multiplier over what lies under it. `effective` is the merged curve the synth actually consumes: engine-computed, always readable, never writable — never reconstruct it from the layers. Which of these a given (generation x category) has is a host fact, not a property of this roster: `vocalparam layers` reports the matrix, and `effective` exists for every available category.

#### points

```ts
points: unknown;
```

The layer's values, one per clip-local tick from `posBegin`. Shaped by the sibling `encoding` argument: under `json` (the default) a plain array of numbers, `null` at a gap; under `base64` a `PointsEnvelope`, a gap a NaN bit pattern. No IDL type spans both shapes, so this field is declared `json` — see `PointsEnvelope`'s doc comment.

#### role

```ts
role: string;
```

See `LayerDeclaration.role`.

#### sparse

```ts
sparse: boolean;
```

See `LayerDeclaration.sparse`.

***

### engineGeneration

```ts
engineGeneration: string;
```

The clip's singer engine generation.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content token for this category's writable layers (ADR 0088 §5). Carry it into `vocalparam write`'s reserved `fingerprint` argument to fail STALE_WRITE rather than overwrite an edit that landed in between.

***

### layers

```ts
layers: {
  access: "read-only" | "read-write";
  drawnRanges?: {
     begin: number;
     end: number;
  }[];
  layer: "direct" | "baseline" | "user" | "envelope" | "effective";
  points: unknown;
  role: string;
  sparse: boolean;
}[];
```

Every layer this (generation x category) has, merge order first.

#### access

```ts
access: "read-only" | "read-write";
```

Whether a layer can be written, on this clip's engine generation. The two are exclusive: `read-write` names a layer `vocalparam write` may target, `read-only` one it always refuses. The merged `effective` curve is `read-only` on every generation.

#### drawnRanges?

```ts
optional drawnRanges?: {
  begin: number;
  end: number;
}[];
```

For a sparse layer, the clip-local tick ranges that carry drawn values. Absent on a dense layer. Reading this is cheaper than scanning `points` for gaps.

#### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope" | "effective";
```

One layer of a parameter's curve stack, including the merged result. A vocal parameter is not one curve: it is a stack the engine merges. `baseline` is what the engine produced unprompted (the model's analyzed curve, or the generation's synthesized default) and is read-only, because it shifts with every re-render. `user` and `direct` are drawn overrides that win wherever they carry a value and are undrawn elsewhere. `envelope` is a multiplier over what lies under it. `effective` is the merged curve the synth actually consumes: engine-computed, always readable, never writable — never reconstruct it from the layers. Which of these a given (generation x category) has is a host fact, not a property of this roster: `vocalparam layers` reports the matrix, and `effective` exists for every available category.

#### points

```ts
points: unknown;
```

The layer's values, one per clip-local tick from `posBegin`. Shaped by the sibling `encoding` argument: under `json` (the default) a plain array of numbers, `null` at a gap; under `base64` a `PointsEnvelope`, a gap a NaN bit pattern. No IDL type spans both shapes, so this field is declared `json` — see `PointsEnvelope`'s doc comment.

#### role

```ts
role: string;
```

See `LayerDeclaration.role`.

#### sparse

```ts
sparse: boolean;
```

See `LayerDeclaration.sparse`.

***

### posBegin

```ts
posBegin: number;
```

Clip-local tick of element 0. Shared by every layer and by the effective curve, and the value a write restates.

***

### scale?

```ts
optional scale?: string;
```

The value space these numbers live in. See `vocalparam layers`.

***

### unvoiced?

```ts
optional unvoiced?: {
  begin: number;
  end: number;
}[];
```

Clip-local tick ranges the singer produces no voiced sound in. Parameter values there reach no synth, so a consumer computing a transformation can skip them.

#### begin

```ts
begin: number;
```

#### end

```ts
end: number;
```

***

### valueRange?

```ts
optional valueRange?: {
  max?: number;
  min?: number;
};
```

Inclusive bounds of a legal value in a category's scale.

#### max?

```ts
optional max?: number;
```

#### min?

```ts
optional min?: number;
```
