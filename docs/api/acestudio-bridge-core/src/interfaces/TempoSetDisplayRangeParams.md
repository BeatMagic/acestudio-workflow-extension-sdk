# Interface: TempoSetDisplayRangeParams

Arguments for `tempo set-display-range`.

## Properties

### maxBpm?

```ts
optional maxBpm?: number | null;
```

Upper bound of the editor's BPM axis. Must be \> `--min`. Omit to keep the current upper bound.

***

### minBpm?

```ts
optional minBpm?: number | null;
```

Lower bound of the editor's BPM axis. Must be \< `--max`. Omit to keep the current lower bound.
