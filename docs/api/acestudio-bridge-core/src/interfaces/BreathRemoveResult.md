# Interface: BreathRemoveResult

Success payload of `breath remove`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip holding the notes, with braces.

***

### removedCount

```ts
removedCount: number;
```

How many notes changed. 0 means the call left the project untouched and pushed no undo entry.

***

### removedNoteUuids

```ts
removedNoteUuids: string[];
```

The notes that actually lost a breath.

***

### skippedCount

```ts
skippedCount: number;
```

***

### skippedNoteUuids

```ts
skippedNoteUuids: string[];
```

The notes that stored no breath and were left alone.
