# Interface: TimesigSetParams

Arguments for `timesig set`.

## Properties

### signatures

```ts
signatures: {
  barPos: number;
  denominator: number;
  numerator: number;
}[];
```

JSON array of time-signature entries, e.g. `[\{"barPos":0,"numerator":4,"denominator":4\}]`. Each entry: `barPos` (bar \>= 0), `numerator` (2-8), `denominator` (2, 4, 8, 16, or 32). Entries must be sorted by `barPos` ascending with no duplicates.

#### barPos

```ts
barPos: number;
```

Bar position, 0-based. Must be \>= 0.

#### denominator

```ts
denominator: number;
```

Beat unit: 2, 4, 8, 16, or 32.

#### numerator

```ts
numerator: number;
```

Beats per bar, 2-8.
