# Interface: NoteAddResult

Success payload of `note add`.

## Properties

### addedCount

```ts
addedCount: number;
```

Number of notes added.

***

### clipType

```ts
clipType: string;
```

Clip type: `sing`, `instrument`, or `genericMidi`.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip the notes were added to, with braces.

***

### noteCount

```ts
noteCount: number;
```

Total notes in the clip after the add. Nothing existing is disturbed, so this is always the previous count plus `addedCount`; a Sing add that would overlap is refused with `NOTE_OVERLAP` instead (see `help note-exclusivity`).

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the notes that were added, in the order they were given. Address them with the other `note` commands.
