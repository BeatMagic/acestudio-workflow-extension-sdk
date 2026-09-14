# Interface: NoteSetLanguageResult

Success payload of `note set-language`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip holding the notes, with braces.

***

### discardedText

```ts
discardedText: string;
```

Text the refill could not place back onto the notes, discarded. Empty when everything fit — the ordinary case, since the refill re-places the notes' own merged lyrics.

***

### notes

```ts
notes: {
  clearedOverride: boolean;
  dur: number;
  languageAfter: string;
  languageBefore: string;
  languageChanged: boolean;
  lyricAfter: string;
  lyricBefore: string;
  noteUuid: string;
  pos: number;
}[];
```

Every named note, in clip order.

#### clearedOverride

```ts
clearedOverride: boolean;
```

True when the note carried a phoneme override that this write dropped (ADR 0142 §8): the refill respelled the note's lyric, so the user's phonemes for the old spelling went with it, along with any Verse24 consonant lengths measured against them. A language-only change (no lyric rewrite) leaves the override standing.

#### dur

```ts
dur: number;
```

Note duration in ticks.

#### languageAfter

```ts
languageAfter: string;
```

#### languageBefore

```ts
languageBefore: string;
```

The note's language before and after, as full English names (`Chinese`, `English`, ...) — the spelling every other Operation uses.

#### languageChanged

```ts
languageChanged: boolean;
```

True when `languageAfter` differs from `languageBefore`. A note already in the target language can still be reported unchanged here while its lyric moved under the rearranged refill.

#### lyricAfter

```ts
lyricAfter: string;
```

#### lyricBefore

```ts
lyricBefore: string;
```

The note's lyric before and after the refill. Equal when the refill left the text alone.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces.

#### pos

```ts
pos: number;
```

Note start in clip-local ticks.

***

### undoPushed

```ts
undoPushed: boolean;
```

Whether an undo entry reached the stack. False when the change came to nothing at all (every note already in the target language, no lyric moved).

***

### updatedCount

```ts
updatedCount: number;
```

Number of notes whose language or lyric actually changed.
