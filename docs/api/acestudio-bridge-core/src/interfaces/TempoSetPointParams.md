# Interface: TempoSetPointParams

Arguments for `tempo set-point`.

## Properties

### bend?

```ts
optional bend?: number;
```

Curve bend toward the next point, -1.0 to 1.0. 0.0 is a straight segment. Omit to keep an existing point's bend, or 0.0 for a new one.

***

### bpm

```ts
bpm: number;
```

Tempo at this point, in BPM. 1-1000. Required.

***

### pos

```ts
pos: number;
```

Where the point goes, in project ticks. Must be \>= 0. A point already at this position is replaced.
