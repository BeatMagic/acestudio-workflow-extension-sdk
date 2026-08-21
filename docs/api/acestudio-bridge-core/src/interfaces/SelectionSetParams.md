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
