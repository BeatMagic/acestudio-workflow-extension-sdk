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

A `\{begin, end\}` tick range: the arrangement's horizontal (time) selection, or the editor's note selection range in local ticks. Time only. The vertical selection had its own meaning for these two field names — track indices, not ticks — and now has its own type ([`VerticalSelection`]) rather than borrowing a range that says "ticks".

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

The selected time range in seconds, beside the tick range that names the same span. Its own type rather than two more fields on [`SelectionRange`], which the editor's note range shares — and that range is local ticks, where seconds would be a possibility that does not exist. Same reason `clip resize` echoes its own row type rather than reusing a plain one. Reported because a caller that lays the selection over video thinks in seconds while the timeline is ticks, and converting between them needs the tempo curve. `convert tick-to-time` is not that route: it takes an `i32` tick, and a selection range is `i64`, so far enough along the timeline there is no conversion to make.

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
  region?: string;
  trackIndex?: number;
  trackUuid: string;
}[];
```

The tracks the user has selected, individually addressable and not necessarily contiguous — the track head selects them one at a time, so this set can hold gaps. A separate fact from `verticalSelection`, and neither derives from the other. Dragging the band syncs this set to match it, but a set with gaps has no expression as a single range. Read whichever answers the question being asked: they agree until a selection is made from the track head, and answering one from the other is wrong exactly from then on.

#### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, `video`, `marker` or `chord`. Reported rather than assumed, because position 1 names a different track in each band (ADR 0104).

#### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of the track in `region` (ADR 0129 §3). Absent together with `region` when the project cannot place the track.

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
  beginIndex?: number;
  beginRegion?: string;
  endIndex?: number;
  endRegion?: string;
  rawBegin: number;
  rawEnd: number;
};
```

The vertical band of an arrangement selection: **one** contiguous range of tracks, given in both the view's row space and resolved against the regions (ADR 0129 §6). One range rather than one per region, because the user drags one band. A shape reporting several would model the implementation's difficulty — that a region-local index cannot span regions — and hand it to every consumer as a concept to collapse back into what was actually done. A cross-region band has no single region-*local* expression; it has a perfectly good single expression once each endpoint names its own region. Both forms are exact. Unlike the dual-unit rule (ADR 0032) neither is a rounding of the other — rows and region-local indices are a bijection over the layout in force — so nothing here says which is authoritative. **Every bound is inclusive**, including `rawEnd`. The band always covers at least the track it starts on, and the field is absent when nothing is selected, so there is no empty range for an exclusive end to express. The row pair this replaced was documented exclusive and was never produced that way: `TrackViewState` walks `first \<= second`. The rows are always reported; the resolved ends are reported per end, when that end falls on a row the project can place. Not every row belongs to a region — the tempo, time-signature and master rows are pinned bands with no index space of their own — and a drag across them is an ordinary thing to do. Reporting nothing for such a band would answer "nothing is selected" when something is, which is the worse error: it is the only answer a caller cannot tell apart from an empty selection. A named row with no region beside it is not the anonymous index §6 retires; that one was a bare `begin` whose space no reader could name.

#### beginIndex?

```ts
optional beginIndex?: number;
```

Inclusive 0-based position of the band's first row within `beginRegion`. Never present without it (ADR 0129 §1).

#### beginRegion?

```ts
optional beginRegion?: string;
```

Region the band's first row falls in. Absent together with `beginIndex` when that row belongs to no region — a tempo, time-signature or master row — in which case `rawBegin` is the only name that end has.

#### endIndex?

```ts
optional endIndex?: number;
```

Inclusive 0-based position of the band's last row within `endRegion`.

#### endRegion?

```ts
optional endRegion?: string;
```

Region the band's last row falls in — the same as `beginRegion` unless the drag crossed a band boundary. Absent on the same terms.

#### rawBegin

```ts
rawBegin: number;
```

Inclusive first row of the band, in the view's row space, where a pinned band takes negative rows. Prefixed `raw` because a bare `begin` on a track range is the anonymous number ADR 0129 §6 retires: nothing in the name says which index space it counts in, and on an arrangement track the row and the region-local index coincide — so a caller tests it successfully and misaddresses the moment a pinned content track is in play.

#### rawEnd

```ts
rawEnd: number;
```

Inclusive last row of the band, in the same space.
