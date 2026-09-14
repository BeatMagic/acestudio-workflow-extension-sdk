# Interface: TrackAuditionNoteOffParams

Arguments for `track audition note-off`.

## Properties

### pitches

```ts
pitches: number[];
```

MIDI note numbers, 0–127. Releasing a pitch that is not sounding is a no-op, not an error.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in; see AuditionNoteParams.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format. Mutually exclusive with `trackIndex`.
