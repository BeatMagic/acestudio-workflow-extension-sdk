# Interface: EditorAddNotesParams

Arguments for `editor add-notes`.

## Properties

### language?

```ts
optional language?: string | null;
```

[Sentence mode] Language code for the entire lyric sentence (`CHN`/`JPN`/`ENG`/`SPA`/`KOR`). Defaults to the track's default language. Only used when `--lyric-sentence` is specified.

***

### lyric\_sentence?

```ts
optional lyric_sentence?: string | null;
```

[Sentence mode, RECOMMENDED for Sing clips] Lyric sentence to auto-distribute across notes using the G2P backend. Supports syllable indices (`word#N`) and tenuto (`-`). Mutually exclusive with per-note `lyric` fields inside `notes`.

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

Array of note objects. Required and non-empty. Each note must have `pos`, `dur`, and `pitch`. Lyric fields depend on the editor type and mode - see `editor add-notes` documentation for Sing vs Instrument vs GenericMidi.

On the CLI, pass as a JSON string: `--notes '[\{"pos":0,"dur":480,"pitch":60\}]'`

#### articulation?

```ts
optional articulation?: string | null;
```

Articulation for Instrument notes (optional). Trimmed and lowercased before validation.

#### dur

```ts
dur: number;
```

Duration in ticks. Must be \> 0.

#### language?

```ts
optional language?: string | null;
```

[Per-note mode] Language code for this note: `CHN`, `JPN`, `ENG`, `SPA`, or `KOR`. Defaults to the track's default language.

#### lyric?

```ts
optional lyric?: string | null;
```

[Per-note mode] Lyric for Sing notes. Use `"-"` for tenuto (extends the previous syllable). Mutually exclusive with top-level `lyric_sentence`.

#### pitch

```ts
pitch: number;
```

MIDI pitch (0-127).

#### pos

```ts
pos: number;
```

Position in local ticks (relative to the editor's `tickBegin`).

***

### offset?

```ts
optional offset?: number | null;
```

Tick offset applied to the marker-line position before placing notes. Default: 0. A positive value shifts notes to the right.
