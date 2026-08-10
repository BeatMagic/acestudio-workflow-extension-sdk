# Interface: TimesigSetAtParams

Arguments for `timesig set-at`.

## Properties

### barPos

```ts
barPos: number;
```

The same bar counted from 0, as the project stores it and as `convert` reports it. This is the spelling the wire takes. `acestudio-cli` and MCP also accept `bar` counting from 1, folding it to this before the call; pass one or the other, never both.

***

### denominator

```ts
denominator: number;
```

Beat unit: 2, 4, 8, 16, or 32. Required.

***

### numerator

```ts
numerator: number;
```

Beats per bar, 1-32. Required.
