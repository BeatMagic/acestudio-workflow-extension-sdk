# Interface: NoteResizeParams

Arguments for `note resize`.

## Properties

### dur

```ts
dur: number;
```

New duration for every named note. Ticks (`480t`), a note value (`1/4`, `1/8.`), beats (`2b`), or measures (`1bar`). Must be positive. See `help time-values`.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the notes to resize, from `clip note-content`. Repeat the flag or pass several values after one flag.
