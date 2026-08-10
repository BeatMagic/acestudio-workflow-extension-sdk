# Interface: NoteSplitResult

Success payload of `note split`.

## Properties

### clipType

```ts
clipType: string;
```

Clip type of the holding clip.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip holding the note.

***

### head

```ts
head: {
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
};
```

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

***

### noteUuids

```ts
noteUuids: string[];
```

The two halves, head first. The head keeps the original UUID.

***

### tail

```ts
tail: {
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
};
```

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
