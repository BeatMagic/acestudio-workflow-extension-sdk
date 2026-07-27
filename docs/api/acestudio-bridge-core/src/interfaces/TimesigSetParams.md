# Interface: TimesigSetParams

Arguments for `timesig set`.

## Properties

### signatures

```ts
signatures: unknown;
```

JSON array of time-signature entries, e.g. `[\{"barPos":0,"numerator":4,"denominator":4\}]`. Each entry: `barPos` (bar \>= 0), `numerator` (2-8), `denominator` (2, 4, 8, 16, or 32). Entries must be sorted by `barPos` ascending with no duplicates.
