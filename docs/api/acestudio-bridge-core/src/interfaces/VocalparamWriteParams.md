# Interface: VocalparamWriteParams

Arguments for `vocalparam write`.

## Properties

### category

```ts
category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

Parameter category to write: `pitch`, `energy`, `tension`, `air`, `falsetto`, or `formant`.

***

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form, e.g. `\{6f1c...\}`).

***

### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope";
```

The writable layer to replace — required, and never `effective`: the merge is engine-owned (ADR 0085). `vocalparam layers` marks which layers this clip's generation lets you write.

***

### points

```ts
points: 
  | Uint8Array<ArrayBufferLike>
  | Int16Array<ArrayBufferLike>
  | Int32Array<ArrayBufferLike>
  | BigInt64Array<ArrayBufferLike>
  | Float32Array<ArrayBufferLike>
| Float64Array<ArrayBufferLike>;
```

The replacement values, one per clip-local tick from `--pos-begin`.

A JSON array of numbers (`null` clears a tick back to undrawn), or the base64 envelope `\{"dtype":"f64le","count":N,"data":"..."\}` with `--encoding base64`. Read it from a file with `\@curve.json` or from a pipe with `\@-` — a curve does not belong on a command line.

***

### posBegin

```ts
posBegin: number;
```

Clip-local tick the written span starts at — element 0 of `--points` lands here. Pass back the `posBegin` from the read you transformed.
