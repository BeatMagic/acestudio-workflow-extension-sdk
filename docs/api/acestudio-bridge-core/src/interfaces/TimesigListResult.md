# Interface: TimesigListResult

Success payload of `timesig list`.

## Properties

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the whole time-signature list. Carry it back as the reserved `fingerprint` argument on `timesig set-at`, `timesig remove-at` or `timesig set` to fail STALE_WRITE instead of overwriting edits made since this read.

***

### nativeUnit

```ts
nativeUnit: "bar";
```

The unit a `timesig list` position is authoritative in. Always `bar`: a signature entry is addressed by the bar it takes effect from, and the `tick` and `sec` reported beside it are derived from the current grid.

***

### signatureCount

```ts
signatureCount: number;
```

Number of entries in `signatures` (convenience field).

***

### signatures

```ts
signatures: {
  barPos: number;
  denominator: number;
  numerator: number;
  sec: number;
  tick: number;
}[];
```

All time-signature entries, in ascending barPos order.

#### barPos

```ts
barPos: number;
```

The bar this signature takes effect from, counted from 0 as the project stores it. The native unit, and what `set-at` takes verbatim.

#### denominator

```ts
denominator: number;
```

Beat unit; one of 2, 4, 8, 16, 32.

#### numerator

```ts
numerator: number;
```

Beats per bar (1-32).

#### sec

```ts
sec: number;
```

The same bar start in seconds, under the current tempo curve.

#### tick

```ts
tick: number;
```

Project tick that bar starts at. Derived from every earlier signature, so inserting one moves this for the entries after it.
