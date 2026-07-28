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

Example: `--notes '[\{"pos":0,"dur":480,"pitch":60,"lyric":"la"\}]'`

***

### pos

```ts
pos: number;
```

Clip start position. Ticks (`3840t`), clock time (`1.5s`, `1:23.5`), or musical position (`4.1.0`). See `help time-values`.

***

### trackIndex

```ts
trackIndex: number;
```

Target track index (0-based). Empty tracks are automatically converted to the appropriate type.

***

### type

```ts
type: string;
```

Clip type: `sing`, `instrument`, or `genericMidi` — the same spellings `clipType` is reported in. Matched case-insensitively.
