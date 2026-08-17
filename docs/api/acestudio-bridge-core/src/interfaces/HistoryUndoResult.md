# Interface: HistoryUndoResult

Success payload of `history undo`.

## Properties

### canRedo

```ts
canRedo: boolean;
```

Whether an entry can be redone afterwards.

***

### canUndo

```ts
canUndo: boolean;
```

Whether another entry can be undone afterwards.

***

### count

```ts
count: number;
```

Total entries on the stack afterwards. Unchanged by undo/redo, which never push.

***

### entry

```ts
entry: {
  actor: string;
  name: string;
};
```

One stack entry, as every verb here reports it.

#### actor

```ts
actor: string;
```

The peer that authored the entry, or empty when the user authored it in Studio directly.

#### name

```ts
name: string;
```

The entry's user-readable name, as shown in Studio's Undo menu. Localized to the app language.

***

### index

```ts
index: number;
```

How many entries are applied afterwards; entries at index and above are the redo branch.
