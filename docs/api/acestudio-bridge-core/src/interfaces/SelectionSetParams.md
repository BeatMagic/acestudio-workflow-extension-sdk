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

A selected time range in seconds, beside the tick range that names the same span. Its own type rather than two more fields on [`SelectionRange`]: this one is always the derived reading, and folding it in would leave one struct whose halves have different authority with nothing on it saying so. Same reason `clip resize` echoes its own row type rather than reusing a plain one. **Counts in whatever space the tick range beside it counts in** — global seconds beside an arrangement range, and beside an editor range the elapsed wall clock from the open clip's start, so 0 falls where local tick 0 does. A seconds field that silently changed coordinate space from its own tick range would be the trap the pair exists to close. `editor tick-range`'s `beginSec` lifts a local reading to global seconds, exactly, both being measured from the same converted instant. Reported because a caller that lays the selection over video thinks in seconds while the timeline is ticks, and converting between them needs the tempo curve. `convert tick-to-time` is not that route: it takes an `i32` tick, and a selection range is `i64`, so far enough along the timeline there is no conversion to make.

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

[editor] Inclusive start of the selection range, editor-local ticks. Wins over `rangeBeginSec` when both are named — the editor range is tick-native (ADR 0032 §5).

***

### rangeBeginSec?

```ts
optional rangeBeginSec?: number;
```

[editor] The start in editor-local SECONDS instead — elapsed wall clock from the open clip's start, the space `caret get` reports under `editor` scope. Converted under the tempo curve. Local rather than global for the reason [`TimeRangeSeconds`] gives: a seconds argument that counted in a different space from the tick argument beside it would silently address a different instant. Add `editor tick-range`'s `beginSec` to convert a global reading down.

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

[editor] Exclusive end of the selection range, editor-local ticks. Must be greater than the start. Wins over `rangeEndSec` on the same terms.

***

### rangeEndSec?

```ts
optional rangeEndSec?: number;
```

[editor] The end in editor-local seconds instead, on the same terms.

***

### scope?

```ts
optional scope?: string;
```

Selection scope: `arrangement` (timeline) or `editor`. Omitted targets the arrangement.

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
  region?: string;
  trackIndex?: number;
  trackUuid?: string;
}[];
```

[arrangement] Discrete set of tracks to select; each entry must have at least `trackIndex` or `trackUuid`. An empty array clears the track selection. Passing this selects that set instead of an area range.

#### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Defaults to `arrangement`, which is what an unqualified index has always meant here.

#### trackIndex?

```ts
optional trackIndex?: number;
```

Addressed by position: 0-based position in `region`.

#### trackUuid?

```ts
optional trackUuid?: string;
```

Addressed by identity: the braced track UUID (`\{abc-...\}`). Names a track in any region, so it needs no `region` beside it.

***

### verticalSelection?

```ts
optional verticalSelection?: {
  beginIndex?: number;
  beginRegion?: string;
  endIndex?: number;
  endRegion?: string;
  rawBegin?: number;
  rawEnd?: number;
};
```

How a write names the vertical band it wants selected: the resolved region-local ends, or the raw view rows. One form per call. Two optional groups rather than a required [`VerticalSelection`], because a caller should not have to compute the addressing it did not use. Both ends of whichever form is given are required, and every bound is inclusive, as on the read side. The resolved form is what the rest of this surface speaks, and is the one to reach for. The raw form is here for a caller that already holds screen geometry — it is not a shortcut for "I did not want to look up the region", because a raw row means nothing without knowing the view's layout.

#### beginIndex?

```ts
optional beginIndex?: number;
```

Inclusive 0-based position of that end within `beginRegion`. Required with `endIndex`: one end is half a band.

#### beginRegion?

```ts
optional beginRegion?: string;
```

Which index space `beginIndex` counts in. Defaults to `arrangement` when omitted, as an unqualified index does everywhere a track is addressed (ADR 0129 §1) — so a band wholly inside the arrangement names two indices and nothing else. Each end defaults on its own: a drag out of the video band into the arrangement gives `beginRegion` and lets the other end take the default.

#### endIndex?

```ts
optional endIndex?: number;
```

Inclusive 0-based position of that end within `endRegion`. Required with `beginIndex`.

#### endRegion?

```ts
optional endRegion?: string;
```

Which index space `endIndex` counts in. Defaults to `arrangement`, as `beginRegion` does.

#### rawBegin?

```ts
optional rawBegin?: number;
```

Inclusive first row of the band, in the view's row space. Required with `rawEnd`, and refused alongside the resolved form.

#### rawEnd?

```ts
optional rawEnd?: number;
```

Inclusive last row of the band, in the view's row space.
