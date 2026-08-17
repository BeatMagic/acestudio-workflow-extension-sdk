# Interface: SelectionSetResult

Success payload of `selection set`.

## Properties

### editorType?

```ts
optional editorType?: string;
```

Clip type of the active editor.

***

### horizontalSelection?

```ts
optional horizontalSelection?: {
  begin: number;
  end: number;
};
```

A `\{begin, end\}` range: ticks for the arrangement's horizontal (time) and vertical (track index) selection, local ticks for the editor's note selection range.

#### begin

```ts
begin: number;
```

Inclusive start of the range.

#### end

```ts
end: number;
```

Exclusive end of the range.

***

### itemsSelected?

```ts
optional itemsSelected?: number;
```

Number of notes/chords selected (range form).

***

### notesDeselected?

```ts
optional notesDeselected?: number;
```

Notes deselected by this call (UUID modify form).

***

### notesNotFound?

```ts
optional notesNotFound?: number;
```

UUIDs that did not match any note (UUID form).

***

### notesSelected?

```ts
optional notesSelected?: number;
```

Notes newly selected by this call (UUID form).

***

### rangeBegin?

```ts
optional rangeBegin?: number;
```

Inclusive selection start applied, in local ticks (range form).

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

Exclusive selection end applied, in local ticks (range form).

***

### selectionCount?

```ts
optional selectionCount?: number;
```

Total notes selected after the operation (UUID form).

***

### selectionRange?

```ts
optional selectionRange?: {
  begin: number;
  end: number;
};
```

A `\{begin, end\}` range: ticks for the arrangement's horizontal (time) and vertical (track index) selection, local ticks for the editor's note selection range.

#### begin

```ts
begin: number;
```

Inclusive start of the range.

#### end

```ts
end: number;
```

Exclusive end of the range.

***

### success?

```ts
optional success?: boolean;
```

True on success.

***

### verticalSelection?

```ts
optional verticalSelection?: {
  begin: number;
  end: number;
};
```

A `\{begin, end\}` range: ticks for the arrangement's horizontal (time) and vertical (track index) selection, local ticks for the editor's note selection range.

#### begin

```ts
begin: number;
```

Inclusive start of the range.

#### end

```ts
end: number;
```

Exclusive end of the range.
