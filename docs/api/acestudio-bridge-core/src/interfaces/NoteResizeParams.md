# Interface: NoteResizeParams

Arguments for `note resize`.

## Properties

### dur

```ts
dur: number;
```

New duration for every named note, in ticks. Must be positive.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the notes to resize, from `clip note-content`.
