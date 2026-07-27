# Interface: TrackSingerRecipeParams

Arguments for `track singer-recipe`.

## Properties

### singerIndex?

```ts
optional singerIndex?: number | null;
```

0-based singer index within the track. Defaults to 0 (leader / only singer). For choir tracks, 0 is the leader, 1+ are members.

***

### trackIndex

```ts
trackIndex: number;
```

0-based track index. Must point to a Sing track.
