# Interface: SelectionSetParams

Arguments for `selection set`.

## Properties

### horizontalSelection?

```ts
optional horizontalSelection?: 
  | {
  begin: number;
  end: number;
}
  | null;
```

[arrangement] Time range to select, as `\{"begin": \<ticks\>, "end": \<ticks\>\}`.

#### Union Members

##### Type Literal

```ts
{
  begin: number;
  end: number;
}
```

##### begin

```ts
begin: number;
```

Inclusive start of the range (ticks for horizontal; track index for vertical; can be negative for special tracks).

##### end

```ts
end: number;
```

Exclusive end of the range (ticks for horizontal; track index for vertical; can be negative for special tracks).

***

`null`

***

### mode?

```ts
optional mode?: string | null;
```

[editor, UUID form] Selection mode: `replace` or `modify`.

***

### notesToDeselect?

```ts
optional notesToDeselect?: unknown;
```

[editor, UUID modify form] Notes to deselect, as a JSON array of `\{uuid\}` objects. Ignored in replace mode.

***

### notesToSelect?

```ts
optional notesToSelect?: unknown;
```

[editor, UUID form] Notes to select, as a JSON array of `\{uuid\}` objects.

***

### rangeBegin?

```ts
optional rangeBegin?: number | null;
```

[editor] Inclusive start of the selection range, editor-local. Ticks (`480t`) or a position resolved into the clip frame. See `help time-values`.

***

### rangeEnd?

```ts
optional rangeEnd?: number | null;
```

[editor] Exclusive end of the selection range, editor-local. Must be greater than `--range-begin`. See `help time-values`.

***

### scope

```ts
scope: string;
```

Selection scope: `arrangement` (timeline, default) or `editor`.

***

### selectNotes?

```ts
optional selectNotes?: boolean | null;
```

[editor, range form] If true, select all notes/chords overlapping the range; if false (default) set only the visual range for parameter editing.

***

### tracks?

```ts
optional tracks?: unknown;
```

[arrangement] Discrete set of tracks to select, as a JSON array of identifier objects; each must have at least `trackIndex` or `trackUuid`. An empty array clears the track selection. Passing this selects that set instead of an area range.

Example: `[\{"trackIndex": 0\}, \{"trackUuid": "\{abc-...\}"\}]`

***

### verticalSelection?

```ts
optional verticalSelection?: 
  | {
  begin: number;
  end: number;
}
  | null;
```

[arrangement] Track index range to select, as `\{"begin": \<idx\>, "end": \<idx\>\}` (0-based; negative addresses special tracks).

#### Union Members

##### Type Literal

```ts
{
  begin: number;
  end: number;
}
```

##### begin

```ts
begin: number;
```

Inclusive start of the range (ticks for horizontal; track index for vertical; can be negative for special tracks).

##### end

```ts
end: number;
```

Exclusive end of the range (ticks for horizontal; track index for vertical; can be negative for special tracks).

***

`null`
