# Interface: TimesigGetResult

Success payload of `timesig get`.

## Properties

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
}[];
```

All time-signature entries, in ascending barPos order.

#### barPos

```ts
barPos: number;
```

0-based bar at which this signature takes effect.

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
