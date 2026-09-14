# Interface: BreathSetResult

Success payload of `breath set`.

## Properties

### clampedCount

```ts
clampedCount: number;
```

How many of them had their requested length clamped. 0 means every note got the length asked for.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip holding the notes, with braces.

***

### notes

```ts
notes: {
  clampedBy: "none" | "min" | "max" | "wall";
  drawnSec: number;
  effectiveSec: number;
  noteUuid: string;
  overlapSec: number;
  requestedSec: number;
  shown: boolean;
}[];
```

The notes after the write, in the order they were given.

#### clampedBy

```ts
clampedBy: "none" | "min" | "max" | "wall";
```

Which edge of the editing band held a requested length back. Clamping silently is right for a mouse and wrong for a caller that named a number: the wall limit is data-dependent, and the band is stated in DRAWN units, so the legal range for a request shifts with the overlap and no caller can predict the clamp from a length alone.

#### drawnSec

```ts
drawnSec: number;
```

The remainder the visibility gate tests: the walled request less the overlap. See `BreathRow.drawnSec`.

#### effectiveSec

```ts
effectiveSec: number;
```

What the engine renders it as. NOT the request less the overlap.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces.

#### overlapSec

```ts
overlapSec: number;
```

The consonant reach this note's clamp was computed against.

#### requestedSec

```ts
requestedSec: number;
```

The length now stored on the note: the requested one, clamped.

#### shown

```ts
shown: boolean;
```

Whether the breath just written is actually audible. A set can land a breath the consonants immediately cover; the length still stands, and it appears when they retreat.

***

### updatedCount

```ts
updatedCount: number;
```

How many notes were written.
