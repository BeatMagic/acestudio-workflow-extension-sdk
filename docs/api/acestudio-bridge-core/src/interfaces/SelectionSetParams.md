# Interface: SelectionSetParams

Arguments for `selection set`.

## Properties

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

### mode?

```ts
optional mode?: string;
```

[editor, UUID form] Selection mode: `replace` or `modify`.

***

### notesToDeselect?

```ts
optional notesToDeselect?: {
  uuid: string;
}[];
```

[editor, UUID modify form] Notes to deselect. Ignored in replace mode.

#### uuid

```ts
uuid: string;
```

***

### notesToSelect?

```ts
optional notesToSelect?: {
  uuid: string;
}[];
```

[editor, UUID form] Notes to select.

#### uuid

```ts
uuid: string;
```

***

### rangeBegin?

```ts
optional rangeBegin?: number;
```

[editor] Inclusive start of the selection range, editor-local ticks.

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

[editor] Exclusive end of the selection range, editor-local ticks. Must be greater than `rangeBegin`.

***

### scope

```ts
scope: string;
```

Selection scope: `arrangement` (timeline, default) or `editor`.

***

### selectNotes?

```ts
optional selectNotes?: boolean;
```

[editor, range form] If true, select all notes/chords overlapping the range; if false (default) set only the visual range for parameter editing.

***

### tracks?

```ts
optional tracks?: {
  trackIndex?: number;
  trackUuid?: string;
}[];
```

[arrangement] Discrete set of tracks to select; each entry must have at least `trackIndex` or `trackUuid`. An empty array clears the track selection. Passing this selects that set instead of an area range.

#### trackIndex?

```ts
optional trackIndex?: number;
```

Addressed by position: 0-based index.

#### trackUuid?

```ts
optional trackUuid?: string;
```

Addressed by identity: the braced track UUID (`\{abc-...\}`).

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
