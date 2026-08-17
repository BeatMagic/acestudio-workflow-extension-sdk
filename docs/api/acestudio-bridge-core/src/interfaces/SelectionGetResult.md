# Interface: SelectionGetResult

Success payload of `selection get`.

## Properties

### editorType?

```ts
optional editorType?: string;
```

Clip type of the active editor: Sing, Instrument, GenericMidi, Audio, or Chord.

***

### hasSelection?

```ts
optional hasSelection?: boolean;
```

Whether anything is selected. Always false for the audio editor.

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

### horizontalSelectionSec?

```ts
optional horizontalSelectionSec?: {
  beginSec: number;
  endSec: number;
};
```

The selected time range in seconds, beside the tick range that names the same span. Its own type rather than two more fields on [`SelectionRange`], which is shared with the vertical selection — whose `begin`/`end` are TRACK INDICES. Seconds there would be a possibility that does not exist, which is the same reason `clip resize` echoes its own row type rather than reusing a plain one. Reported because a caller that lays the selection over video thinks in seconds while the timeline is ticks, and converting between them needs the tempo curve. `convert tick-to-time` is not that route: it takes an `i32` tick, and a selection range is `i64`, so far enough along the timeline there is no conversion to make.

#### beginSec

```ts
beginSec: number;
```

Inclusive start of the range, in seconds.

#### endSec

```ts
endSec: number;
```

Exclusive end of the range, in seconds.

***

### isLineSelection?

```ts
optional isLineSelection?: boolean;
```

True when the selection is a zero-width vertical line (caret) rather than an area.

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

Selected notes. Present only for note editors with a selection.

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

Stable note UUID (with braces); use with `selection set` (editor scope, UUID form).

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

Number of selected track ids (may exceed selectedTracks' length if a selected slot has no track).

***

### selectedTracks?

```ts
optional selectedTracks?: {
  trackIndex: number;
  trackUuid: string;
}[];
```

Discrete set of selected tracks. Distinct from verticalSelection's contiguous index range.

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

Number of selected notes; 0 or 1 for the chord editor.

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
