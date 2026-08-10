# Interface: ClipCreateParams

Arguments for `clip create`.

## Properties

### dur

```ts
dur: number;
```

Clip duration. Ticks (`3840t`), a note value (`1/4`, `1/8.`), beats (`2b`), or whole measures (`2bar`, anchored at `--pos`). See `help time-values`.

***

### name?

```ts
optional name?: string | null;
```

Optional custom name. Omit to let ACE Studio auto-generate a name.

For a `marker` clip this is the marker's annotation text, and omitting it is normal — the timeline then shows its "double click to write text" prompt.

***

### notes?

```ts
optional notes?: 
  | {
  articulation?: string | null;
  dur: number;
  language?: string | null;
  lyric?: string | null;
  pitch: number;
  pos: number;
}[]
  | null;
```

Initial notes, as a JSON array in clip-local ticks — the same shape `note add` takes. Omit to create an empty clip.

Rejected for `marker` and `chord`, which hold no notes.

Example: `--notes '[\{"pos":0,"dur":480,"pitch":60,"lyric":"la"\}]'`

***

### onOccupied?

```ts
optional onOccupied?: string | null;
```

What to do when the new clip's span is already occupied on the target track: `fail` (default), or `cover` to trim the clips in the way.

***

### pos

```ts
pos: number;
```

Clip start position. Ticks (`3840t`), clock time (`1.5s`, `1:23.5`), or musical position (`4.1.0`). See `help time-values`.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

Target track index (0-based). Empty tracks are automatically converted to the appropriate type.

Required for `sing`, `instrument` and `genericMidi`. **Rejected** for `marker` and `chord`: there is exactly one track of each, so the clip type already names the target, and passing an index would look like a choice you do not have.

***

### type

```ts
type: string;
```

Clip type: `sing`, `instrument`, `genericMidi`, `marker`, or `chord` — the same spellings `clipType` is reported in. Matched case-insensitively.

`audio` and `video` are not creatable here: a media clip's duration comes from the file, not from `--dur`. Use `import file` instead.
