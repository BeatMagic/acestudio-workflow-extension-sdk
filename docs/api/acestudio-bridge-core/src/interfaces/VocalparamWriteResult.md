# Interface: VocalparamWriteResult

Success payload of `vocalparam write`.

## Properties

### category

```ts
category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

The category written.

***

### clearedCount?

```ts
optional clearedCount?: number;
```

How many of those values were gaps (`null` / NaN) and so returned the tick to undrawn rather than setting a value.

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

Values written: the span covers ticks `posBegin` through `posBegin + count - 1`.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

The category's content token *after* the write — what to carry into the next guarded write without re-reading.

***

### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope";
```

The layer written. Never `effective`.

***

### posBegin

```ts
posBegin: number;
```

Clip-local tick the written span starts at.
