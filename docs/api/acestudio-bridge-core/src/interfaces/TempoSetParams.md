# Interface: TempoSetParams

Arguments for `tempo set`.

## Properties

### points

```ts
points: {
  bend?: number;
  pos: number;
  value: number;
}[];
```

#### bend?

```ts
optional bend?: number;
```

Curve bend, -1.0 to 1.0. Defaults to 0.0 (a straight segment).

#### pos

```ts
pos: number;
```

Position in ticks. Must be \>= 0.

#### value

```ts
value: number;
```

Tempo in BPM, 1-1000.
