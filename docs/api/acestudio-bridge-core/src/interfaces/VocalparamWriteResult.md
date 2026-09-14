# Interface: VocalparamWriteResult

Success payload of `vocalparam write`.

## Properties

### clearedCount?

```ts
optional clearedCount?: number;
```

How many of those values were gaps (`null` / NaN) and so returned the tick to undrawn rather than setting a value. Present on a `dense` write only.

***

### clipUuid

```ts
clipUuid: string;
```

The clip written to.

***

### count

```ts
count: number;
```

Values written: the tick count of a `dense` span, the anchor count of a `points` payload (gap markers included), or 1 for a `scalar` write.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

The parameter's content token *after* the write — what to carry into the next guarded write without re-reading.

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

The parameter written.

***

### posBegin?

```ts
optional posBegin?: number;
```

Clip-local tick the written span starts at. Present on a `dense` write only; absent on `points` (the span is the payload's own first anchor tick) and `scalar` (no ticks are covered).
