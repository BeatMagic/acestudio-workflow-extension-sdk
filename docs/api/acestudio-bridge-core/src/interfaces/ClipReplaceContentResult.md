# Interface: ClipReplaceContentResult

Success payload of `clip replace-content`.

## Properties

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

UUID of the clip whose content was replaced, with braces.

***

### noteCount

```ts
noteCount: number;
```

Number of notes now in the clip.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the notes now in the clip, in the order they were given.

***

### previousNoteCount

```ts
previousNoteCount: number;
```

Number of notes the clip held before the swap.
