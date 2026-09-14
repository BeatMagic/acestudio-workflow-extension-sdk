# Interface: VocalparamReadParams

Arguments for `vocalparam read`.

## Properties

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

Wire encoding of a dense point payload. `json` is the default: points travel as a plain array of numbers with `null` at a gap, which costs nothing to read with `jq` and keeps a curve inspectable without tooling. `base64` travels as the self-describing little-endian envelope (see `PointsEnvelope`), a gap a NaN bit pattern — bit-exact and compact, which is what a long curve wants. The encoding applies to `dense` layers only: a `points` layer always travels as `[[tick, value], …]` JSON anchors and a `scalar` layer as a bare JSON number, whatever this argument says — their ticks and shape are self-describing, so there is nothing to encode.

***

### layer?

```ts
optional layer?: "direct" | "baseline" | "user" | "envelope" | "global" | "effective";
```

One layer of a parameter's curve stack, including the merged result. A vocal parameter is not one curve: it is a stack the engine merges. `baseline` is what the engine produced unprompted (the model's analyzed curve, or the generation's synthesized default) and is read-only, because it shifts with every re-render. `user` and `direct` are drawn overrides that win wherever they carry a value and are undrawn elsewhere. `envelope` is a multiplier over what lies under it. `global` is a control lane's scalar offset, added to its drawn points. `effective` is the merged curve the synth actually consumes — present on a parameter where something merges (ADR 0155) — never reconstruct it from the layers. Which of these a given (generation x parameter) has is a host fact, not a property of this roster: `vocalparam layers` reports the matrix, and the merge's result (`effective`, where it exists) is always readable.

***

### param

```ts
param: string;
```

The parameter to read — any id the roster lists: one this tree owns, `dynamic`, or a control the singer publishes. See `vocalparam layers` for what this clip has.

***

### rangeBegin?

```ts
optional rangeBegin?: number;
```

First clip-local tick to read. Defaults to the clip's visible start. Bounds a `dense` layer's grid and a `points` layer's anchors alike.

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

Clip-local tick to read up to, exclusive. Defaults to the clip's visible end.
