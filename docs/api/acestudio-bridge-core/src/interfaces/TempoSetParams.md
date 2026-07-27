# Interface: TempoSetParams

Arguments for `tempo set`.

## Properties

### points

```ts
points: {
  bend?: number | null;
  pos: number;
  value: number;
}[];
```

JSON array of tempo points, e.g. `[\{"pos":0,"value":120\}]`. Each point: `pos` (ticks \>= 0), `value` (BPM 1-1000), `bend` (optional, default 0.0). Points must be sorted by `pos` ascending with no duplicates.

#### bend?

```ts
optional bend?: number | null;
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
