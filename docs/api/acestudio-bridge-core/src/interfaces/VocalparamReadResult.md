# Interface: VocalparamReadResult

Success payload of `vocalparam read`.

## Properties

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

Elements per `dense` layer: one per clip-local tick, so the last covers tick `posBegin + count - 1`.

***

### displayName

```ts
displayName: string;
```

The parameter's display name, as the vocal-control panel shows it.

***

### effective?

```ts
optional effective?: {
  access: "read-only" | "read-write";
  drawnRanges?: {
     begin: number;
     end: number;
  }[];
  layer: "direct" | "baseline" | "user" | "envelope" | "global" | "effective";
  points: unknown;
  role: string;
  shape: "dense" | "points" | "scalar";
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

For a sparse layer, the clip-local tick ranges that carry drawn values. Absent on a non-sparse layer. Reading this is cheaper than scanning `points` for gaps.

#### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope" | "global" | "effective";
```

One layer of a parameter's curve stack, including the merged result. A vocal parameter is not one curve: it is a stack the engine merges. `baseline` is what the engine produced unprompted (the model's analyzed curve, or the generation's synthesized default) and is read-only, because it shifts with every re-render. `user` and `direct` are drawn overrides that win wherever they carry a value and are undrawn elsewhere. `envelope` is a multiplier over what lies under it. `global` is a control lane's scalar offset, added to its drawn points. `effective` is the merged curve the synth actually consumes — present on a parameter where something merges (ADR 0155) — never reconstruct it from the layers. Which of these a given (generation x parameter) has is a host fact, not a property of this roster: `vocalparam layers` reports the matrix, and the merge's result (`effective`, where it exists) is always readable.

#### points

```ts
points: unknown;
```

The layer's values, in the layer's declared `shape`: for `dense`, one value per clip-local tick from `posBegin` — a plain array under `encoding: json` (`null` at a gap), a `PointsEnvelope` under `base64` (a NaN bit pattern at a gap); for `points`, `[[tick, value], …]` anchors with `[tick, null]` gap markers; for `scalar`, one bare number. No IDL type spans these shapes, so this field is declared `json` — see `PointsEnvelope`'s doc comment.

#### role

```ts
role: string;
```

See `LayerDeclaration.role`.

#### shape

```ts
shape: "dense" | "points" | "scalar";
```

The shape a layer's points take, declared on every layer so a consumer introspects it rather than special-casing by parameter. The verbs follow the declaration: `posBegin` and the two-consecutive-tick run rule are `dense`-only. `effective` is `dense` and read-only wherever the parameter has a merge — shape polymorphism only ever touches writable layers.

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

Content token for this parameter's writable layers (ADR 0088 §5). Carry it into `vocalparam write`'s reserved `fingerprint` argument to fail STALE_WRITE rather than overwrite an edit that landed in between.

***

### layers

```ts
layers: {
  access: "read-only" | "read-write";
  drawnRanges?: {
     begin: number;
     end: number;
  }[];
  layer: "direct" | "baseline" | "user" | "envelope" | "global" | "effective";
  points: unknown;
  role: string;
  shape: "dense" | "points" | "scalar";
  sparse: boolean;
}[];
```

Every layer this (generation x parameter) has, merge order first.

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

For a sparse layer, the clip-local tick ranges that carry drawn values. Absent on a non-sparse layer. Reading this is cheaper than scanning `points` for gaps.

#### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope" | "global" | "effective";
```

One layer of a parameter's curve stack, including the merged result. A vocal parameter is not one curve: it is a stack the engine merges. `baseline` is what the engine produced unprompted (the model's analyzed curve, or the generation's synthesized default) and is read-only, because it shifts with every re-render. `user` and `direct` are drawn overrides that win wherever they carry a value and are undrawn elsewhere. `envelope` is a multiplier over what lies under it. `global` is a control lane's scalar offset, added to its drawn points. `effective` is the merged curve the synth actually consumes — present on a parameter where something merges (ADR 0155) — never reconstruct it from the layers. Which of these a given (generation x parameter) has is a host fact, not a property of this roster: `vocalparam layers` reports the matrix, and the merge's result (`effective`, where it exists) is always readable.

#### points

```ts
points: unknown;
```

The layer's values, in the layer's declared `shape`: for `dense`, one value per clip-local tick from `posBegin` — a plain array under `encoding: json` (`null` at a gap), a `PointsEnvelope` under `base64` (a NaN bit pattern at a gap); for `points`, `[[tick, value], …]` anchors with `[tick, null]` gap markers; for `scalar`, one bare number. No IDL type spans these shapes, so this field is declared `json` — see `PointsEnvelope`'s doc comment.

#### role

```ts
role: string;
```

See `LayerDeclaration.role`.

#### shape

```ts
shape: "dense" | "points" | "scalar";
```

The shape a layer's points take, declared on every layer so a consumer introspects it rather than special-casing by parameter. The verbs follow the declaration: `posBegin` and the two-consecutive-tick run rule are `dense`-only. `effective` is `dense` and read-only wherever the parameter has a merge — shape polymorphism only ever touches writable layers.

#### sparse

```ts
sparse: boolean;
```

See `LayerDeclaration.sparse`.

***

### param

```ts
param: string;
```

The parameter read.

***

### posBegin

```ts
posBegin: number;
```

Clip-local tick of element 0 of every `dense` layer. Shared by the effective curve, and the value a `dense` write restates. `points` layers carry their own ticks.

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

Inclusive bounds of a legal value in a parameter's scale.

#### max?

```ts
optional max?: number;
```

#### min?

```ts
optional min?: number;
```
