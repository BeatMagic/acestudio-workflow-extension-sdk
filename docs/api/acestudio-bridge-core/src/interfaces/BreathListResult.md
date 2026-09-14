# Interface: BreathListResult

Success payload of `breath list`.

## Properties

### breathCount

```ts
breathCount: number;
```

How many of them store a breath.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip reported, with braces.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint at the phoneme-layout scope (ADR 0088 §5, ADR 0142 §6): moves on note-content changes AND on a landed synthesis result, so a caller can tell that the overlaps this read reported have gone stale.

***

### noteCount

```ts
noteCount: number;
```

***

### notes

```ts
notes: {
  drawnSec: number;
  effectiveSec: number;
  hasBreath: boolean;
  insertableSpaceSec: number;
  maxLenSec: number;
  minLenSec: number;
  noteStartSec: number;
  noteUuid: string;
  overlapSec: number;
  pos: number;
  requestedSec: number;
  shown: boolean;
}[];
```

One row per head note, in pattern order. Notes storing no breath are included, because their rows carry the space and the band a caller needs to place one.

#### drawnSec

```ts
drawnSec: number;
```

The remainder the visibility gate tests: the walled request less the overlap. `\<= 0` on a breath the consonants cover completely, and below `kBreathHiddenBelowSec` (0.05s) the breath is not sent — which is the one case where this is not simply `effectiveSec` less `overlapSec`, since `effectiveSec` has gone to 0 and this still says how far under the gate it fell. It is what the panel paints, and it is never what goes on the wire.

#### effectiveSec

```ts
effectiveSec: number;
```

What the engine renders: the request held at the wall, or 0 when the breath is below the gate and nothing is sent. NOT the request less the overlap.

#### hasBreath

```ts
hasBreath: boolean;
```

Whether the note stores a breath at all. Deliberately distinct from `shown`: a stored breath that is currently inaudible keeps its length and can come back, where a note storing none has nothing to come back.

#### insertableSpaceSec

```ts
insertableSpaceSec: number;
```

The drawn length a breath filling all the room to the wall would have. `\<= 0` on notes flush enough that the consonants reach back past it.

#### maxLenSec

```ts
maxLenSec: number;
```

The longest. Equal to `minLenSec` on a note whose room has fallen below the editing minimum, where the wall leaves exactly one legal length. Both are 0 on a note that begins exactly at the wall — there is no legal length at all there, and `breath set` refuses rather than storing a 0 that would mean no breath.

#### minLenSec

```ts
minLenSec: number;
```

The shortest length `breath set` will write on this note without clamping.

#### noteStartSec

```ts
noteStartSec: number;
```

Note start in pattern-local seconds — the frame every length below is measured in, and the breath's own right edge.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces — what `breath set` and `breath remove` address.

#### overlapSec

```ts
overlapSec: number;
```

How far this note's leading consonants reach back over the breath. Moves on a landed synthesis result without any edit to the note.

#### pos

```ts
pos: number;
```

Note start in clip-local ticks, the frame `clip note-content` reports.

#### requestedSec

```ts
requestedSec: number;
```

The stored length — what was asked for. 0 when `hasBreath` is false.

#### shown

```ts
shown: boolean;
```

Whether the breath is drawn and sent. False for a stored breath the consonants have covered past the gate.

***

### shownCount

```ts
shownCount: number;
```

How many of them store a breath that is actually audible. Lower than `breathCount` exactly when the consonants have covered one past the gate.
