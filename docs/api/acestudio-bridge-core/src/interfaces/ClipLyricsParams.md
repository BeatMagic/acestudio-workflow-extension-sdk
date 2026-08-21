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
optional rangeBegin?: number;
```

Start of the time-range filter in ticks. Defaults to `clipBegin`.

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

End of the time-range filter in ticks. Defaults to `clipEnd`.

***

### rangeScope?

```ts
optional rangeScope?: string;
```

Coordinate system for `rangeBegin`/`rangeEnd`: `project` (default) = global timeline; `clip-local` = coordinates from the clip's own start.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video`, `marker`, or `chord`. The regions are isolated index spaces (ADR 0104), so an index read against the wrong one names an unrelated track (ADR 0129 §1).

***

### trackIndex

```ts
trackIndex: number;
```

Track position (0-based) in `region`.
