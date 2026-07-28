# Interface: NoteAddParams

Arguments for `note add`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip. Accepted with or without curly braces. The clip must be a note clip (Sing, Instrument, or GenericMidi).

***

### notes

```ts
notes: {
  articulation?: string | null;
  dur: number;
  language?: string | null;
  lyric?: string | null;
  pitch: number;
  pos: number;
}[];
```

Notes to add, as a JSON array. Each note takes `pos` and `dur` in clip-local ticks plus `pitch`; Sing notes also take `lyric` and optional `language`, Instrument notes optional `articulation`.

Bulk is the primitive, not a convenience: on a Sing clip the whole batch is resolved against the monophonic rule at once (`help note-exclusivity`).

Example: `--notes '[\{"pos":0,"dur":480,"pitch":60,"lyric":"la"\}]'`

#### articulation?

```ts
optional articulation?: string | null;
```

Articulation name for Instrument clips. Defaults to the track's default articulation.

#### dur

```ts
dur: number;
```

Note duration in ticks. Must be positive.

#### language?

```ts
optional language?: string | null;
```

Per-note language override for Sing clips: `CHN`, `JPN`, `ENG`, `SPA`, or `KOR`. Defaults to the track's default language.

#### lyric?

```ts
optional lyric?: string | null;
```

Lyric text. Required for Sing clips; `-` marks a tenuto that extends the previous syllable (see `help note-exclusivity`). Ignored for Instrument and GenericMidi clips.

#### pitch

```ts
pitch: number;
```

MIDI pitch, 0-127.

#### pos

```ts
pos: number;
```

Note start in clip-local ticks.
