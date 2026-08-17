# Interface: TempoSetDisplayRangeParams

Arguments for `tempo set-display-range`.

## Properties

### maxBpm?

```ts
optional maxBpm?: number;
```

Upper bound of the editor's BPM axis. Must be \> `minBpm`. Omit to keep the current upper bound.

***

### minBpm?

```ts
optional minBpm?: number;
```

Lower bound of the editor's BPM axis. Must be \< `maxBpm`. Omit to keep the current lower bound.
