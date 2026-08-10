# Interface: TimesigSetAtResult

Success payload of `timesig set-at`.

## Properties

### barPos

```ts
barPos: number;
```

The bar acted on, counted from 0 — the same value whichever spelling the call used to address it. Reported as `bar` counting from 1 instead under `--bars human`.

***

### replaced

```ts
replaced: boolean;
```

Whether an entry already existed at `barPos`. True for a `set-at` that overwrote one and for every successful `remove-at`; false for a `set-at` that inserted a new entry.

***

### signatureCount

```ts
signatureCount: number;
```

Number of entries in the list after the write.
