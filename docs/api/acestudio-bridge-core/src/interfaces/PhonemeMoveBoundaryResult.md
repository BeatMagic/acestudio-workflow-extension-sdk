# Interface: PhonemeMoveBoundaryResult

Success payload of `phoneme move-boundary`.

## Properties

### boundaryStartSec

```ts
boundaryStartSec: number;
```

Where the addressed boundary ended up. Not necessarily where the request aimed: a move is clamped at the scope's capacity one way and at the line's own phoneme's floor width the other, and a length is clamped to what the editor's own drag allows. This is the answer, so no re-read is needed.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip the write landed in, with braces.

***

### dryRun

```ts
dryRun: boolean;
```

Whether this was a dry run: everything solved and reported, nothing written.

***

### pinned

```ts
pinned: {
  index: number;
  noteUuid: string;
}[];
```

Every phoneme this write pinned, in time order. A pin is set span-complete, so this is the whole span rather than the phonemes whose duration changed — and routinely spans two notes. Empty when the write landed in consonant lengths, which have no completeness requirement.

#### index

```ts
index: number;
```

0-based position in the note's phonemes, in emission order.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces.

***

### representation

```ts
representation: "pins" | "consonant-lengths";
```

Which representation of phoneme timing a note actually holds. Reported rather than inferred from the track's model: neither representation belongs exclusively to a generation, and a note has no generation of its own.

***

### timeBase

```ts
timeBase: string;
```

What every second on this response is measured from: `clip-local`, seconds from the clip's own origin. Stated because a note's leading consonants can start before the clip does, which makes a negative second an ordinary answer rather than a bug.

***

### undoPushed

```ts
undoPushed: boolean;
```

Whether an undo entry was pushed. False on a dry run, and false when the write resolved to the state the note was already in.

***

### writes

```ts
writes: {
  durationSec: number;
  effectiveDurationSec?: number;
  index: number;
  name: string;
  noteUuid: string;
}[];
```

Every duration written, in time order — every one, not just the addressed phoneme. A move writes whatever paid for its delta as well as the phoneme whose edge moved, and a length write reports any neighbour the run's re-clamp adjusted alongside it.

#### durationSec

```ts
durationSec: number;
```

What was stored: the pin on Verse 2.6, the consonant length on Verse24.

#### effectiveDurationSec?

```ts
optional effectiveDurationSec?: number;
```

What that comes to right now, present only when it differs from `durationSec` — a Verse24 consonant compressed against the limit it shares with its neighbour. Never write it back: it is a circumstance of the current neighbourhood, not intent (ADR 0142 §4).

#### index

```ts
index: number;
```

0-based position in that note's phonemes, in emission order.

#### name

```ts
name: string;
```

The symbol, as the note spells it.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID of the phoneme's own note, with braces. Not necessarily the note the request named: a move pays for its delta out of the phonemes left of the line, and a span crosses notes.
