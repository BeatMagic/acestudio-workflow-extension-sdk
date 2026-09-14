# Interface: TrackAuditionNoteParams

Arguments for `track audition note`.

## Properties

### duration?

```ts
optional duration?: number;
```

Seconds until the note releases itself, default 1.0. Must be positive. The release is scheduled server-side when the call is dispatched, so a caller that never calls again cannot leave a note sounding.

***

### pitches

```ts
pitches: number[];
```

MIDI note numbers, 0–127. Several in one call sound together as a chord, not as an arpeggio the caller assembles with timers.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video`, `marker`, or `chord`. Every accepted track type lives in the arrangement; the other spellings resolve so their track can be refused with AUDITION_NOT_SUPPORTED rather than an addressing error. Ignored beside `trackUuid`, which needs no region.

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

0–127, default 100 — the piano strip's own velocity (`GenericMidiNoteInfo::kDefaultVelocity`).
