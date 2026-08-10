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

JSON array of time-signature entries, e.g. `[\{"barPos":0,"numerator":4,"denominator":4\}]`. Each entry: the bar as `barPos` (\>= 0, counting from 0), `numerator` (1-32), `denominator` (2, 4, 8, 16, or 32). `acestudio-cli` and MCP also accept `bar` counting from 1 in place of `barPos`, folding it before the call; pass one or the other, never both. Entries must be sorted by ascending bar with no duplicates.

#### barPos

```ts
barPos: number;
```

The same bar counted from 0, as the project stores it. Give this or `bar`, never both.

#### denominator

```ts
denominator: number;
```

Beat unit: 2, 4, 8, 16, or 32.

#### numerator

```ts
numerator: number;
```

Beats per bar, 1-32.
