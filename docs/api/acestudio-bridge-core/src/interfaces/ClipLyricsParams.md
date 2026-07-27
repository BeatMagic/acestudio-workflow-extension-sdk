# Interface: ClipLyricsParams

Arguments for `clip lyrics`.

## Properties

### clipIndex

```ts
clipIndex: number;
```

Clip index within the track (0-based). Clip must be of type Sing; other types return an error.

***

### rangeBegin?

```ts
optional rangeBegin?: number | null;
```

Start of the time-range filter in ticks. Defaults to `clipBegin`.

***

### rangeEnd?

```ts
optional rangeEnd?: number | null;
```

End of the time-range filter in ticks. Defaults to `clipEnd`.

***

### rangeScope?

```ts
optional rangeScope?: string | null;
```

Coordinate system for `rangeBegin`/`rangeEnd`. `project` (default) = global timeline; `canvas` = pattern-local coordinates.

***

### trackIndex

```ts
trackIndex: number;
```

Track index (0-based).
