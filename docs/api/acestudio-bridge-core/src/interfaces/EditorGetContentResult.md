# Interface: EditorGetContentResult

Success payload of `editor get-content`.

## Properties

### actualRange

```ts
actualRange: object;
```

The tick range that was actually queried.

#### begin

```ts
begin: number;
```

Inclusive range start in local ticks.

#### end

```ts
end: number;
```

Exclusive range end in local ticks.

***

### chordCount?

```ts
optional chordCount?: number;
```

Number of chords returned. Present for the chord editor only.

***

### chords?

```ts
optional chords?: object[];
```

Chords overlapping the range. Present for the chord editor only.

#### addeds

```ts
addeds: string[];
```

Added-tone modifications.

#### basicKeys

```ts
basicKeys: number[];
```

Pitch classes (0-11) of the chord.

#### bass

```ts
bass: string;
```

Bass note, for slash chords.

#### dur

```ts
dur: number;
```

Chord duration in ticks.

#### endPos

```ts
endPos: number;
```

Chord end in local ticks (pos + dur).

#### isSelected

```ts
isSelected: boolean;
```

Whether this is the chord editor's selected chord.

#### keys

```ts
keys: number[];
```

Actual MIDI pitches of the chord.

#### pos

```ts
pos: number;
```

Chord start in local ticks.

#### root

```ts
root: string;
```

Chord root, e.g. C.

#### type

```ts
type: string;
```

Chord type, e.g. maj7.

#### viewName

```ts
viewName: string;
```

Display name of the chord, e.g. Gmaj7.

***

### noteCount?

```ts
optional noteCount?: number;
```

Number of notes returned. Present for note editors only.

***

### notes?

```ts
optional notes?: object[];
```

Notes overlapping the range. Present for note editors (Sing/Instrument/GenericMidi); absent for the chord editor.

#### articulation?

```ts
optional articulation?: string;
```

Articulation key. Instrument notes only.

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

#### headConsonants?

```ts
optional headConsonants?: number[];
```

Head consonant lengths in seconds. Sing notes only.

#### isSelected

```ts
isSelected: boolean;
```

Whether the note is currently selected in the editor.

#### language?

```ts
optional language?: string;
```

Note language as an English full name. Sing notes only.

#### lyric?

```ts
optional lyric?: string;
```

Note lyric. Sing notes only.

#### pitch

```ts
pitch: number;
```

MIDI pitch (0-127).

#### pos

```ts
pos: number;
```

Note start in local ticks (relative to the editor's tickBegin).

#### syllable?

```ts
optional syllable?: string;
```

Phonetic syllable string. Sing notes only.

#### tailConsonants?

```ts
optional tailConsonants?: number[];
```

Tail consonant lengths in seconds. Sing notes only.

***

### rangeType

```ts
rangeType: string;
```

Resolved range selector: all, clip_region, viewport, or custom.
