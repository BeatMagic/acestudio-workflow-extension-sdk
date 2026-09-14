# Interface: LyricFillResult

Success payload of `lyric fill`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The clip every addressed note belongs to.

***

### discardedText

```ts
discardedText: string;
```

The text the notes ran out before consuming, discarded. Empty when everything fit. Rendered in the input's own alphabet, so it can be handed to a second fill over the following notes.

***

### dryRun

```ts
dryRun: boolean;
```

Echo of the `dryRun` argument.

***

### intent

```ts
intent: "from-sentence" | "from-single-note" | "as-batch-editor" | "mechanism";
```

Which affordance a call emulated, or `mechanism` when it named the fillers' setters directly instead.

***

### mechanism

```ts
mechanism: {
  filler: "one-by-one" | "tenuto-standby";
  fillScope: "target" | "to-clip-end";
  followNoteLanguage: boolean;
  matchGraphemeLanguage: boolean;
  singleNoteMode: boolean;
  skipTenuto: boolean;
};
```

The fillers' settings as this call resolved them — every axis, whichever group the caller used (ADR 0142 §7). A caller wanting a combination no intent offers reads this off a first call and re-issues in mechanism form.

#### filler

```ts
filler: "one-by-one" | "tenuto-standby";
```

Which shipped filler ran. Named as the mechanism argument spells it, because a caller re-issuing a reported combination copies this value straight back.

#### fillScope

```ts
fillScope: "target" | "to-clip-end";
```

How far past the addressed notes a fill reaches.

#### followNoteLanguage

```ts
followNoteLanguage: boolean;
```

`setShouldFillNoteLang` — whether the fill wrote a language onto the notes at all. False leaves every `languageAfter` equal to its `languageBefore`.

#### matchGraphemeLanguage

```ts
matchGraphemeLanguage: boolean;
```

`setMatchGraphemeLang` — when a grapheme does not resolve under a note's own language, whether the note follows the grapheme's language (true) or the grapheme is written as an error grapheme (false). Read only when `followNoteLanguage` is set.

#### singleNoteMode

```ts
singleNoteMode: boolean;
```

`setIsSingleNoteSelected`. NOT a mechanism argument: it is the axis that decides what empty input does, and ADR 0142 §7 holds that difference to be the intent rather than a setting on top of it. Reported because it is a resolved value a caller can otherwise only infer.

#### skipTenuto

```ts
skipTenuto: boolean;
```

Whether melismatic notes were dropped from the target list before filling. The lyrics panel's "skip tenuto" checkbox; false on every other path.

***

### normalizedText

```ts
normalizedText: string;
```

The input after the splitter's own normalisation — whitespace simplified, tenuto/quote/question-mark variants unified. What the fill actually consumed, so a caller can see a substitution rather than deduce it.

***

### noteCount

```ts
noteCount: number;
```

***

### notes

```ts
notes: {
  clearedOverride: boolean;
  dur: number;
  filled: boolean;
  languageAfter: string;
  languageBefore: string;
  languageChanged: boolean;
  lyricAfter: string;
  lyricBefore: string;
  noteUuid: string;
  pos: number;
  promoted: boolean;
}[];
```

Every note in scope, in clip order.

#### clearedOverride

```ts
clearedOverride: boolean;
```

True when the note carried a phoneme override that this write dropped (ADR 0142 §8). A new lyric means a new pronunciation, so the user's phonemes for the old one go with it, along with any Verse24 consonant lengths measured against them.

#### dur

```ts
dur: number;
```

#### filled

```ts
filled: boolean;
```

True when this note received a grapheme FROM THE INPUT, as opposed to being blanked by a trailing pass or left alone. This is the numerator of `notesFilled`.

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

True when `languageAfter` differs from `languageBefore`. Broken out because a fill rewrites the language of notes the caller never named, and ADR 0142 §5 requires every one of those changes to be visible.

#### lyricAfter

```ts
lyricAfter: string;
```

#### lyricBefore

```ts
lyricBefore: string;
```

The note's lyric before and after the fill. Equal when the fill left the note alone. An empty `lyricAfter` is a BLANKED note, which a filler's trailing pass writes when the text ran out before the notes did.

#### noteUuid

```ts
noteUuid: string;
```

#### pos

```ts
pos: number;
```

Clip-local ticks.

#### promoted

```ts
promoted: boolean;
```

True when a melismatic note was promoted to carry a syllable of its own — it held a tenuto before and holds a grapheme now. The iterative overflow rule promotes the rightmost melismatic group's leftmost note first.

***

### notesFilled

```ts
notesFilled: number;
```

The lyrics panel's `Notes filled M/N` counter. `notesFilled` is the number of rows with `filled` set and `noteCount` is the notes in scope after any melismatic filtering — so this pair is computed BY THE FILL. The panel's own label counts input graphemes against a note total it took before filling, and the two can therefore disagree for the same input.

***

### sentences?

```ts
optional sentences?: {
  index: number;
  sentenceBegin: number;
  sentenceEnd: number;
  text: string;
}[];
```

The sentences this fill wrote into, present when the call addressed a sentence by index. More than one entry only under `alignLinesToSentences`.

#### index

```ts
index: number;
```

The sentence's index in the clip's shipped split.

#### sentenceBegin

```ts
sentenceBegin: number;
```

Sentence start in clip-local ticks.

#### sentenceEnd

```ts
sentenceEnd: number;
```

Sentence end in clip-local ticks.

#### text

```ts
text: string;
```

The line of input this sentence received. The whole (flattened) text unless `alignLinesToSentences` was set.

***

### timeBase

```ts
timeBase: string;
```

Coordinate frame of every tick in this result: always `clip-local`.

***

### undoPushed

```ts
undoPushed: boolean;
```

Whether an undo entry reached the stack. False on a dry run, and false when the fill came to no change at all.
