# Interface: PhonemeSetConsonantTimingParams

Arguments for `phoneme set-consonant-timing`.

## Properties

### dryRun?

```ts
optional dryRun?: boolean;
```

Solve and report without writing. Leaves the undo stack untouched.

***

### index

```ts
index: number;
```

0-based position in that note's phonemes, in emission order. Must name a consonant: a vowel has no length of its own to set on either generation — on Verse24 it is the note's remainder, and a caller that wants it shorter moves the consonants around it.

***

### lengthSec

```ts
lengthSec: number;
```

How long that consonant should be, in seconds. Stored as intent: on Verse24 it is scaled at read time against a limit the note shares with its neighbour, so an `effectiveDurationSec` appears on the written row when this note's number is already being compressed. A length too long or too short is CLAMPED to what the editor's own drag allows, and the response reports what it became. A NEGATIVE length is refused instead: it is not a length the clamp can bring into range, it is a caller that computed one wrong, and clamping it to the floor would write a number nobody asked for.

***

### noteUuids

```ts
noteUuids: string[];
```

UUID of the note the consonant belongs to, with braces. Exactly one — a length is one number about one consonant. A tenuto note resolves to its group's head note. Spelled as a list for the reason `MoveBoundaryParams` gives.
