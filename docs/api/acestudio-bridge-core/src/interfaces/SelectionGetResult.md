# Interface: SelectionGetResult

Success payload of `selection get`.

## Properties

### editorType?

```ts
optional editorType?: string;
```

Clip type of the active editor: Sing, Instrument, GenericMidi, Audio, or Chord (editor scope).

***

### hasSelection?

```ts
optional hasSelection?: boolean;
```

Whether anything is selected (editor scope). Always false for the audio editor.

***

### horizontalSelection?

```ts
optional horizontalSelection?: {
  begin: number;
  end: number;
};
```

Selected time range on the timeline (arrangement scope).

#### begin

```ts
begin: number;
```

Inclusive start of the selected time range, in project ticks.

#### end

```ts
end: number;
```

Exclusive end of the selected time range, in project ticks.

***

### isLineSelection?

```ts
optional isLineSelection?: boolean;
```

True when the selection is a zero-width vertical line (caret) rather than an area (arrangement scope).

***

### notes?

```ts
optional notes?: {
  dur: number;
  endPos: number;
  noteUuid: string;
  pitch: number;
  pos: number;
}[];
```

Selected notes (editor scope). Present only for note editors with a selection.

#### dur

```ts
dur: number;
```

Note duration in ticks.

#### endPos

```ts
endPos: number;
```

Note end in local ticks (pos + dur).

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID (with braces); use with `selection set --scope editor`.

#### pitch

```ts
pitch: number;
```

MIDI pitch (0-127).

#### pos

```ts
pos: number;
```

Note start in local ticks.

***

### selectedTrackCount?

```ts
optional selectedTrackCount?: number;
```

Number of selected track ids (arrangement scope; may exceed selectedTracks length if a selected slot has no track).

***

### selectedTracks?

```ts
optional selectedTracks?: {
  trackIndex: number;
  trackUuid: string;
}[];
```

Discrete set of selected tracks, in selection order (arrangement scope). Distinct from verticalSelection's contiguous index range.

#### trackIndex

```ts
trackIndex: number;
```

0-based track index.

#### trackUuid

```ts
trackUuid: string;
```

Track UUID in braces format.

***

### selectionCount?

```ts
optional selectionCount?: number;
```

Number of selected notes (editor scope); 0 or 1 for the chord editor.

***

### verticalSelection?

```ts
optional verticalSelection?: {
  begin: number;
  end: number;
};
```

Selected track index range (arrangement scope).

#### begin

```ts
begin: number;
```

Inclusive start of the selected track index range (0-based; negative for special tracks).

#### end

```ts
end: number;
```

Exclusive end of the selected track index range (0-based; negative for special tracks).
