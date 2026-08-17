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

The actual tick range used for filtering `clip note-content` / `clip lyrics`. Present only when `rangeBegin` and/or `rangeEnd` was supplied.

#### begin

```ts
begin: number;
```

Filter range start, in ticks, in the coordinate system named by `scope`.

#### end

```ts
end: number;
```

Filter range end (exclusive), in ticks, in the coordinate system named by `scope`.

#### scope

```ts
scope: string;
```

Coordinate system of `begin`/`end`: `project` or `clip-local`.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the whole clip's note content (ADR 0088 §5). Carry it back as the `fingerprint` argument on `clip replace-content` or any `note` write to fail STALE_WRITE instead of overwriting edits made since this read. Always covers the full clip, even when the read was range-filtered.

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

Instrument notes only: the note's articulation.

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

Sing notes only: leading consonant lengths in seconds.

#### language?

```ts
optional language?: string;
```

Sing notes only: the note's language, spelled in full English.

#### lyric?

```ts
optional lyric?: string;
```

Sing notes only: the note's lyric. `-` marks a tenuto continuing the previous syllable.

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

Sing notes only: the phonemes the engine derived from the lyric.

#### tailConsonants?

```ts
optional tailConsonants?: number[];
```

Sing notes only: trailing consonant lengths in seconds.
