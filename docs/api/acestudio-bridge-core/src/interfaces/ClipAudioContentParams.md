# Interface: ClipAudioContentParams

Arguments for `clip audio-content`.

## Properties

### clipIndex

```ts
clipIndex: number;
```

Clip index within the track (0-based). The clip must be of type `Audio`; other clip types return an error.

***

### trackIndex

```ts
trackIndex: number;
```

Track index (0-based).
