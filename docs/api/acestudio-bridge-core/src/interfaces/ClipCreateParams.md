# Interface: ClipCreateParams

Arguments for `clip create`.

## Properties

### dur

```ts
dur: number;
```

Clip duration, in ticks.

***

### name?

```ts
optional name?: string;
```

Optional custom name. Omit to let ACE Studio auto-generate a name. For a `marker` clip this is the marker's annotation text.

***

### notes?

```ts
optional notes?: {
  articulation?: string;
  dur: number;
  language?: string;
  lyric?: string;
  pitch: number;
  pos: number;
}[];
```

Initial notes, in clip-local ticks — the same document `note add` takes. Omit to create an empty clip. Rejected for `marker` and `chord`, which hold no notes.

#### articulation?

```ts
optional articulation?: string;
```

Articulation name for Instrument clips. Defaults to the track's default articulation.

#### dur

```ts
dur: number;
```

Note duration in ticks. Must be positive.

#### language?

```ts
optional language?: string;
```

Per-note language override for Sing clips: `CHN`, `JPN`, `ENG`, `SPA`, or `KOR`. Defaults to the track's default language.

#### lyric?

```ts
optional lyric?: string;
```

Lyric text. Required for Sing clips; `-` marks a tenuto that extends the previous syllable. Ignored for Instrument and GenericMidi clips.

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

***

### onOccupied?

```ts
optional onOccupied?: string;
```

What to do when the new clip's span is already occupied on the target track: `fail` (default), or `cover` to trim the clips in the way.

***

### pos

```ts
pos: number;
```

Clip start position, in ticks.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

Target track index (0-based). Empty tracks are automatically converted to the appropriate type. Required for `sing`, `instrument` and `genericMidi`, where it is the arrangement index. For `marker` it is OPTIONAL and means something else: the local index of the lane inside the Marker band, which is an ordered first-class region (ADR 0019/0104) rather than a single fixture. Omit for the band's first lane. Read the band with `track list --type marker`, whose rows carry `protectedRole` for finding the Sections or Lyrics lane by role. Rejected only for `chord`: there is exactly one Chord track, so an index beside the type would suggest a choice that does not exist.

***

### type

```ts
type: string;
```

Clip type: `sing`, `instrument`, `genericMidi`, `marker`, or `chord` — the same spellings `clipType` is reported in. Matched case-insensitively. `audio` and `video` are not creatable here: a media clip's duration comes from the file, not from `dur`. Use `import file` instead.
