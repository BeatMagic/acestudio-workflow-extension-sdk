# Interface: TimesigSetAtParams

Arguments for `timesig set-at`.

## Properties

### barPos

```ts
barPos: number;
```

The same bar counted from 0, as the project stores it and as `timesig list` reports it.

***

### denominator

```ts
denominator: number;
```

Beat unit; one of 2, 4, 8, 16, 32.

***

### numerator

```ts
numerator: number;
```

Beats per bar (1-32).
