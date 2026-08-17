# Interface: ClipReplaceContentParams

Arguments for `clip replace-content`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip. The clip must be a note clip (Sing, Instrument, or GenericMidi).

***

### notes

```ts
notes: {
  articulation?: string;
  dur: number;
  language?: string;
  lyric?: string;
  pitch: number;
  pos: number;
}[];
```

The clip's new notes, in clip-local ticks. An empty array clears the clip.

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
