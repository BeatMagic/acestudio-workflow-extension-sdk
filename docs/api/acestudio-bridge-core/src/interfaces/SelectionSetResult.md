# Interface: SelectionSetResult

Success payload of `selection set`.

## Properties

### editorType?

```ts
optional editorType?: string;
```

Clip type of the active editor (editor scope).

***

### horizontalSelection?

```ts
optional horizontalSelection?: object;
```

#### begin

```ts
begin: number;
```

Inclusive start of the applied time range, in project ticks.

#### end

```ts
end: number;
```

Exclusive end of the applied time range, in project ticks.

***

### itemsSelected?

```ts
optional itemsSelected?: number;
```

Number of notes/chords selected (editor scope, range mode).

***

### notesDeselected?

```ts
optional notesDeselected?: number;
```

Notes deselected by this call (editor scope, UUID modify mode).

***

### notesNotFound?

```ts
optional notesNotFound?: number;
```

UUIDs that did not match any note (editor scope, UUID mode).

***

### notesSelected?

```ts
optional notesSelected?: number;
```

Notes newly selected by this call (editor scope, UUID mode).

***

### rangeBegin?

```ts
optional rangeBegin?: number;
```

Inclusive selection start applied, in local ticks (editor scope).

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

Exclusive selection end applied, in local ticks (editor scope).

***

### selectionCount?

```ts
optional selectionCount?: number;
```

Total notes selected after the operation (editor scope, UUID mode).

***

### selectionRange?

```ts
optional selectionRange?: object;
```

#### begin

```ts
begin: number;
```

Inclusive selection start in local ticks (editor scope, UUID mode).

#### end

```ts
end: number;
```

Exclusive selection end in local ticks (editor scope, UUID mode).

***

### success?

```ts
optional success?: boolean;
```

True on success (editor scope).

***

### verticalSelection?

```ts
optional verticalSelection?: object;
```

#### begin

```ts
begin: number;
```

Inclusive start of the applied track index range (0-based; negative for special tracks).

#### end

```ts
end: number;
```

Exclusive end of the applied track index range (0-based; negative for special tracks).
