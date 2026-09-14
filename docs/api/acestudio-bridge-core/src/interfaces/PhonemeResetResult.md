# Interface: PhonemeResetResult

Success payload of `phoneme reset`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip every row belongs to, with braces.

***

### notes

```ts
notes: {
  clearedOverride: boolean;
  clearedTimings: ("pins" | "consonant-lengths")[];
  isOverride: boolean;
  language: string;
  lyric: string;
  noteUuid: string;
  phonemes: string[];
}[];
```

One row per note written, in request order.

#### clearedOverride

```ts
clearedOverride: boolean;
```

Whether this call cleared an override the note was carrying. False on a note that had none, which is how `reset-override`'s silence is visible: nothing cleared, and no undo entry pushed.

#### clearedTimings

```ts
clearedTimings: ("pins" | "consonant-lengths")[];
```

Which timing representations this call cleared. Empty when the note held none. Named as what the note actually held rather than as what its track's generation implies — a Vocal2Midi note on a Verse24 track starts out pinned, and an old project on a Verse 2.6 track can still be carrying consonant lengths. This reports what the call REMOVED, not what a human had chosen. So `pins` covers different amounts of the same list depending on the verb: a call that KEEPS the phonemes clears the pins and leaves the last result's predictions standing, which is what handing timing back to the model means, while a call that clears the override drops the list whole, predictions included, because they were measured on symbols the note no longer sings. The second is a consequence of the rule rather than a separate intention — and it is reported rather than left silent, because the data is gone either way and a caller has no other way to learn it.

#### isOverride

```ts
isOverride: boolean;
```

Whether `phonemes` is an override rather than the derived default.

#### language

```ts
language: string;
```

Full English name of the language the symbols were checked against.

#### lyric

```ts
lyric: string;
```

The note's grapheme, unchanged by every verb in this group.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces — the head note, when the request named a tenuto.

#### phonemes

```ts
phonemes: string[];
```

What the note sings NOW: the override if it still has one, else its default. After `reset-override` or `reset` this is the default, which is re-derived rather than restored from the read — see `clearedOverride`.

***

### undoPushed

```ts
undoPushed: boolean;
```

Whether an undo entry was pushed at all. False means nothing changed: `reset-override` on a note with no override is a no-op that leaves the undo stack untouched, exactly as the emptied phoneme field does.
