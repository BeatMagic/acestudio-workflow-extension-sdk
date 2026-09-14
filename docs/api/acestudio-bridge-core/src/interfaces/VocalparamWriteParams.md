# Interface: VocalparamWriteParams

Arguments for `vocalparam write`.

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

### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope" | "global";
```

A layer `vocalparam write` may target: `ParamLayerName` minus `effective`. `effective` is the merged curve and is never writable (ADR 0085) — the merge rule is engine-owned, and a consumer that could write the merged result would be reimplementing it. Sharing one layer roster with the read side would make a write's schema advertise a value the host always refuses, which is a type that lies about what the operation accepts; so the write side declares its own roster and the value is refused at decode rather than by a handler branch. The roster is still not the availability: `vocalparam layers` marks which of these this clip's generation actually lets you write.

***

### param

```ts
param: string;
```

The parameter to write — any id the roster lists.

***

### points

```ts
points: unknown;
```

The replacement values, in the target layer's declared shape. For `dense`: one value per clip-local tick from `posBegin` — a plain array under `encoding: json` (`null` clears a tick to undrawn), or a `PointsEnvelope` under `base64` whose declared `count` must match its decoded byte length. For `points`: `[[tick, value], …]` anchors with `[tick, null]` gap markers — the write replaces everything the span from its first to its last anchor covers, gaps included. For `scalar`: one bare number. A `dense` write changes ticks in runs, so **every run must cover at least two consecutive ticks** — a run of values or a run of `null` gaps alike. A tick standing on its own between runs of the other kind, or between such a run and the payload's own edge, is rejected: a run of values is drawn as a line and a run of gaps erased as a span, and neither shape reaches one tick. The rule is `dense`-only: a `points` write's anchors are placed, not drawn pairwise, so a lone anchor lands exactly.

***

### posBegin?

```ts
optional posBegin?: number;
```

Clip-local tick the written span starts at — element 0 of a `dense` `points` payload lands here. Pass back the `posBegin` from the read you transformed. Required for a `dense` write, refused for `points` and `scalar` ones: those shapes carry their own ticks, or need none.
