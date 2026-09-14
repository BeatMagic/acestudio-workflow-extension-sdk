# Interface: BreathSetParams

Arguments for `breath set`.

## Properties

### lenSec

```ts
lenSec: number;
```

The length to ask for, in seconds. Must be positive: removal is `breath remove`, not a length of 0. Refused too on a note with no room before it, since the only length that would fit is the 0 this verb must never write. Clamped per note into that note's legal band, by the same rule the panel's drag uses — so a scripted set and a hand drag land on the same number. The result names which bound clamped it, if any.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the Sing notes to place or resize a breath on, from `clip note-content`. All must be in the same clip, and none may be a melismatic note — a breath belongs to the note that starts the syllable.
