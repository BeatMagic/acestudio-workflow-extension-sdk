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

### success?

```ts
optional success?: boolean;
```

True on success.

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
