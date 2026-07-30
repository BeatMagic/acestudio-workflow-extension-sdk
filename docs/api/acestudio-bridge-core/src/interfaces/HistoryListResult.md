# Interface: HistoryListResult

Success payload of `history list`.

## Properties

### canRedo

```ts
canRedo: boolean;
```

Whether `history redo` has an entry to re-apply.

***

### canUndo

```ts
canUndo: boolean;
```

Whether `history undo` has an entry to take back.

***

### count

```ts
count: number;
```

Total entries on the stack, ignoring any `limit`.

***

### entries

```ts
entries: {
  actor: string;
  applied: boolean;
  index: number;
  name: string;
}[];
```

Stack entries newest first (descending index). Truncated to `limit` when one was given; `count` always reports the full stack.

#### actor

```ts
actor: string;
```

The peer that authored the entry, or empty when the user authored it in Studio directly.

#### applied

```ts
applied: boolean;
```

True when the entry is currently applied to the project (undoable); false when it sits on the redo branch.

#### index

```ts
index: number;
```

The entry's 0-based position on the stack, oldest = 0.

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

How many entries are applied; entries at index and above are the redo branch.
