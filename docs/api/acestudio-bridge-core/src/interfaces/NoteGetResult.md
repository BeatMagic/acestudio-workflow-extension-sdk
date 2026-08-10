# Interface: NoteGetResult

Success payload of `note get`.

## Properties

### articulation?

```ts
optional articulation?: string;
```

Instrument notes only: the note's articulation.

***

### clipType

```ts
clipType: string;
```

Clip type: `sing`, `instrument`, or `genericMidi`.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip holding the note, with braces.

***

### dur

```ts
dur: number;
```

Note duration in ticks.

***

### endPos

```ts
endPos: number;
```

Note end in clip-local ticks (pos + dur).

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the whole clip's note content (ADR 0088 §5). Carry it back as `--if-match` on any `note` write or `clip replace-content` to fail STALE_WRITE instead of overwriting edits made since this read.

***

### headConsonants?

```ts
optional headConsonants?: number[];
```

Sing notes only: leading consonant lengths in seconds.

***

### language?

```ts
optional language?: string;
```

Sing notes only: the note's language, spelled in full English.

***

### lyric?

```ts
optional lyric?: string;
```

Sing notes only: the note's lyric. `-` marks a tenuto continuing the previous syllable.

***

### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces.

***

### pitch

```ts
pitch: number;
```

MIDI pitch number.

***

### pos

```ts
pos: number;
```

Note start in clip-local ticks.

***

### syllable?

```ts
optional syllable?: string;
```

Sing notes only: the phonemes the engine derived from the lyric.

***

### tailConsonants?

```ts
optional tailConsonants?: number[];
```

Sing notes only: trailing consonant lengths in seconds.
