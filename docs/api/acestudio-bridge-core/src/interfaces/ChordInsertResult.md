# Interface: ChordInsertResult

Success payload of `chord insert`.

## Properties

### chordCount

```ts
chordCount: number;
```

Number of entries in `chords`.

***

### chords

```ts
chords: {
  addeds: string[];
  bass: number;
  bassName?: string;
  chordUuid: string;
  displayName: string;
  dur: number;
  endPos: number;
  index: number;
  pos: number;
  root: number;
  rootName?: string;
  type: string;
}[];
```

The clip's chords after the write, in playing order.

#### addeds

```ts
addeds: string[];
```

Added tones, e.g. `9`, `sus4`. Empty when the chord has none.

#### bass

```ts
bass: number;
```

Bass pitch class, 0-11. Falls back to the root when the stored value names no note in the chord, so this is the bass that actually sounds.

#### bassName?

```ts
optional bassName?: string;
```

Bass spelled as a note name. Absent when there is no root to fall back on and no bass was chosen.

#### chordUuid

```ts
chordUuid: string;
```

Stable chord UUID, with braces. The address `chord set` and `chord delete` take; it survives inserts and deletes elsewhere in the clip, which an index does not.

#### displayName

```ts
displayName: string;
```

The chord as the app displays it, e.g. `C`, `Am7`, `F#m7b5/A#`. Empty for a placeholder with no root or type.

#### dur

```ts
dur: number;
```

Duration in ticks.

#### endPos

```ts
endPos: number;
```

End in clip-local ticks (pos + dur).

#### index

```ts
index: number;
```

0-based index in the clip's chord list. Reported so a caller can see the order and pass a neighbouring index to `chord insert`; never an address for a write, because inserting shifts it.

#### pos

```ts
pos: number;
```

Position in clip-local ticks, derived from the durations of every chord before this one.

#### root

```ts
root: number;
```

Root pitch class, 0-11 for C through B. `-1` when no root is chosen.

#### rootName?

```ts
optional rootName?: string;
```

Root spelled as a note name (`C`, `F#`). Absent when no root is chosen.

#### type

```ts
type: string;
```

Chord type, e.g. `maj`, `min`. Empty when no type is chosen.

***

### clipDur

```ts
clipDur: number;
```

The clip's own length in ticks, unchanged by a chord write.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip that was written to, echoed back.

***

### contentLength

```ts
contentLength: number;
```

Total length of the chord content after the write, in ticks.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Fresh content fingerprint for the clip's chords, so a caller writing twice in a row need not re-read between the two.

***

### loopCount

```ts
loopCount: number;
```

How many times the content now repeats to fill the clip.

***

### loopLength

```ts
loopLength: number;
```

How far past its content the clip now runs, in ticks.
