# Interface: ClipNoteContentParams

Arguments for `clip note-content`.

## Properties

### clipIndex

```ts
clipIndex: number;
```

Clip index within the track (0-based). Clip must be Sing, Instrument, or GenericMidi; Audio/Chord clips return an error.

***

### rangeBegin?

```ts
optional rangeBegin?: number;
```

Start of the time-range filter in ticks. Defaults to `clipBegin` (the start of the clip's visible region).

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

### trackIndex

```ts
trackIndex: number;
```

Track index (0-based).
