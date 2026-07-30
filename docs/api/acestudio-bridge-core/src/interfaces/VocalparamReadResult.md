# Interface: VocalparamReadResult

Success payload of `vocalparam read`.

## Properties

### category

```ts
category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

The category read.

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
  points: Float64Array<ArrayBufferLike>;
  role: string;
  sparse: boolean;
};
```

The merged final curve the synth consumes. Engine-computed and always read-only; never reconstruct it from the layers.

#### access

```ts
access: "read-only" | "read-write";
```

`read-write` for a layer a write may target, `read-only` otherwise. The effective curve is always read-only.

#### drawnRanges?

```ts
optional drawnRanges?: {
  begin: number;
  end: number;
}[];
```

For a sparse layer, the clip-local tick ranges that carry drawn values. Absent on a dense layer. Reading this is cheaper than scanning the points for gaps.

#### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope" | "effective";
```

Layer name.

#### points

```ts
points: Float64Array<ArrayBufferLike>;
```

The layer's values, one per clip-local tick from `posBegin`. Under `encoding: json` (the default) this field is instead a plain array of numbers, `null` at a gap.

#### role

```ts
role: string;
```

What the layer contributes to the merge: `analyzed-pristine` (the model's unconditioned production), `synthesized-default` (the engine's own curve), `override` (drawn values that win where present), `multiplier` (scales what is under it), or `merged` (the effective curve).

#### sparse

```ts
sparse: boolean;
```

True when the layer carries values only where drawn, with gaps elsewhere (a gap is `null` under `encoding: json`, a NaN bit pattern under `base64`).

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

Content token for this category's writable layers (ADR 0088 §5). Carry it into `vocalparam write --if-match` to fail STALE_WRITE rather than overwrite an edit that landed in between.

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
  points: Float64Array<ArrayBufferLike>;
  role: string;
  sparse: boolean;
}[];
```

Every layer this (generation x category) has, merge order first.

#### access

```ts
access: "read-only" | "read-write";
```

`read-write` for a layer a write may target, `read-only` otherwise. The effective curve is always read-only.

#### drawnRanges?

```ts
optional drawnRanges?: {
  begin: number;
  end: number;
}[];
```

For a sparse layer, the clip-local tick ranges that carry drawn values. Absent on a dense layer. Reading this is cheaper than scanning the points for gaps.

#### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope" | "effective";
```

Layer name.

#### points

```ts
points: Float64Array<ArrayBufferLike>;
```

The layer's values, one per clip-local tick from `posBegin`. Under `encoding: json` (the default) this field is instead a plain array of numbers, `null` at a gap.

#### role

```ts
role: string;
```

What the layer contributes to the merge: `analyzed-pristine` (the model's unconditioned production), `synthesized-default` (the engine's own curve), `override` (drawn values that win where present), `multiplier` (scales what is under it), or `merged` (the effective curve).

#### sparse

```ts
sparse: boolean;
```

True when the layer carries values only where drawn, with gaps elsewhere (a gap is `null` under `encoding: json`, a NaN bit pattern under `base64`).

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

Inclusive bounds of a legal value in this scale.

#### max?

```ts
optional max?: number;
```

#### min?

```ts
optional min?: number;
```
