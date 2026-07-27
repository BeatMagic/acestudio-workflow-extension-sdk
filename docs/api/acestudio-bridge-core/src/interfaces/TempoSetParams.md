# Interface: TempoSetParams

Arguments for `tempo set`.

## Properties

### points

```ts
points: unknown;
```

JSON array of tempo points, e.g. `[\{"pos":0,"value":120\}]`. Each point: `pos` (ticks \>= 0), `value` (BPM 1-1000), `bend` (optional, default 0.0). Points must be sorted by `pos` ascending with no duplicates.
