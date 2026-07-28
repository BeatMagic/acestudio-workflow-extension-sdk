# Interface: NoteSetLyricResult

Success payload of `note set-lyric`.

## Properties

### notes

```ts
notes: {
  language: string;
  lyric: string;
  noteUuid: string;
}[];
```

Notes after the edit, in the order they were given.

#### language

```ts
language: string;
```

Full language name now on the note.

#### lyric

```ts
lyric: string;
```

Lyric text now on the note.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces.

***

### updatedCount

```ts
updatedCount: number;
```

Number of notes whose lyric was set.
