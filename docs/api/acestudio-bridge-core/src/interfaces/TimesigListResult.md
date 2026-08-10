# Interface: TimesigListResult

Success payload of `timesig list`.

## Properties

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the whole time-signature list. Carry it back as `--if-match` on `timesig set-at`, `timesig remove-at` or `timesig set` to fail STALE_WRITE instead of overwriting edits made since this read.

***

### nativeUnit

```ts
nativeUnit: "bar";
```

Which unit the stored positions are authoritative in. Always `bar` for the time-signature list.

***

### signatureCount

```ts
signatureCount: number;
```

Number of entries in signatures (convenience field).

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

All time-signature entries, in ascending barPos order. Dual-unit: `barPos` is authoritative, `tick` and `sec` are where that bar falls under the current meter and tempo.

#### barPos

```ts
barPos: number;
```

The bar this signature takes effect from, counted from 0 as the project stores it. The native unit, and what `set-at --bar-pos` takes verbatim. Reported as `bar` counting from 1 instead under `--bars human`.

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
