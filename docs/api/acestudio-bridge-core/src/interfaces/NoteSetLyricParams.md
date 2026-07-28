# Interface: NoteSetLyricParams

Arguments for `note set-lyric`.

## Properties

### language?

```ts
optional language?: string | null;
```

Language for every named note: `CHN`, `JPN`, `ENG`, `SPA`, or `KOR`. Omit to leave each note's language untouched.

***

### lyric?

```ts
optional lyric?: string | null;
```

One lyric applied to every named note. Use `-` for a tenuto that extends the previous syllable. Mutually exclusive with `--lyrics`.

***

### lyrics?

```ts
optional lyrics?: string[] | null;
```

One lyric per note, as a JSON array of strings positionally matching `--note-uuid`. Length must match exactly.

Example: `--lyrics '["ha","ppy"]'`

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the Sing notes to edit, from `clip note-content`. Repeat the flag or pass several values after one flag.
