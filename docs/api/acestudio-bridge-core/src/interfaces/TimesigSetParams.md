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

#### barPos

```ts
barPos: number;
```

The same bar counted from 0, as the project stores it and as `timesig list` reports it.

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
