# Interface: ClipAudioContentParams

Arguments for `clip audio-content`.

## Properties

### clipIndex

```ts
clipIndex: number;
```

Clip index within the track (0-based). The clip must be of type `Audio`; other clip types return an error.

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
