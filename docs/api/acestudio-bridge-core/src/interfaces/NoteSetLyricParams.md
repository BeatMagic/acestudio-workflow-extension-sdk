# Interface: NoteSetLyricParams

Arguments for `note set-lyric`.

## Properties

### language?

```ts
optional language?: string;
```

Language for every named note: `CHN`, `JPN`, `ENG`, `SPA`, or `KOR`. Omit to leave each note's language untouched.

***

### lyric?

```ts
optional lyric?: string;
```

One lyric applied to every named note. Use `-` for a tenuto that extends the previous syllable. Mutually exclusive with `lyrics`.

***

### lyrics?

```ts
optional lyrics?: string[];
```

One lyric per note, positionally matching `noteUuids`. Length must match exactly. Mutually exclusive with `lyric`.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the Sing notes to edit, from `clip note-content`.
