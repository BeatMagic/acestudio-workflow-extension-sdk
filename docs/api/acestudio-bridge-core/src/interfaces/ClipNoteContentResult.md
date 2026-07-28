# Interface: ClipNoteContentResult

Success payload of `clip note-content`.

## Properties

### filteredRange?

```ts
optional filteredRange?: {
  begin: number;
  end: number;
  scope: string;
};
```

Actual tick range used for filtering. Present only when rangeBegin and/or rangeEnd was supplied.

#### begin

```ts
begin: number;
```

Filter range start, in ticks, in the coordinate system named by scope.

#### end

```ts
end: number;
```

Filter range end (exclusive), in ticks, in the coordinate system named by scope.

#### scope

```ts
scope: string;
```

Coordinate system of begin/end: `project` or `clip-local`.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the whole clip's note content (ADR 0088 §5). Carry it back as `--if-match` on `clip replace-content` or any `note` write to fail STALE_WRITE instead of overwriting edits made since this read. Always covers the full clip, even when the read was range-filtered.

***

### noteCount

```ts
noteCount: number;
```

Number of notes returned.

***

### notes

```ts
notes: {
  articulation?: string;
  dur: number;
  endPos: number;
  headConsonants?: number[];
  language?: string;
  lyric?: string;
  noteUuid: string;
  pitch: number;
  pos: number;
  syllable?: string;
  tailConsonants?: number[];
}[];
```

Notes overlapping the filter range, in pattern order.

#### articulation?

```ts
optional articulation?: string;
```

Articulation name, empty string for Smart (auto). Instrument clips only.

#### dur

```ts
dur: number;
```

Note duration in ticks.

#### endPos

```ts
endPos: number;
```

Note end in clip-local ticks (pos + dur).

#### headConsonants?

```ts
optional headConsonants?: number[];
```

Head consonant lengths in seconds (may be empty). Sing clips only.

#### language?

```ts
optional language?: string;
```

Full language name. Sing clips only.

#### lyric?

```ts
optional lyric?: string;
```

Lyric text. Sing clips only.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces.

#### pitch

```ts
pitch: number;
```

MIDI pitch number.

#### pos

```ts
pos: number;
```

Note start in clip-local ticks.

#### syllable?

```ts
optional syllable?: string;
```

Space-separated phonemes. Sing clips only.

#### tailConsonants?

```ts
optional tailConsonants?: number[];
```

Tail consonant lengths in seconds (may be empty). Sing clips only.
