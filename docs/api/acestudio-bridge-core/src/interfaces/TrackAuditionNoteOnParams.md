# Interface: TrackAuditionNoteOnParams

Arguments for `track audition note-on`.

## Properties

### pitches

```ts
pitches: number[];
```

MIDI note numbers, 0–127. A pitch already sounding is released and retriggered — the piano strip's answer to a repeated press — never stacked.

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

***

### velocity?

```ts
optional velocity?: number;
```

0–127, default 100.
