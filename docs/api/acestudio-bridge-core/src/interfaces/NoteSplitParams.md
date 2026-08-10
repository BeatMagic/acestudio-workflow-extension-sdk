# Interface: NoteSplitParams

Arguments for `note split`.

## Properties

### noteUuids

```ts
noteUuids: string[];
```

UUID of the note to split. Exactly one.

***

### pos

```ts
pos: number;
```

Where to cut, in clip-local ticks. Must fall strictly inside the note and leave both halves at least one grid cell long.
