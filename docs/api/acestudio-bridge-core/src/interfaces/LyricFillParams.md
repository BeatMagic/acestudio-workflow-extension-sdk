# Interface: LyricFillParams

Arguments for `lyric fill`.

## Properties

### alignLinesToSentences?

```ts
optional alignLinesToSentences?: boolean;
```

Map line N of the input to sentence N, counting from the addressed sentence. Requires addressing by `sentenceIndex`, since there are no sentences to align to otherwise. DEFAULTS OFF: `LRCSplitter` calls `simplified()`, so newlines flatten to spaces and the lyrics panel's line-per-sentence seeding is presentation only — text that merely happens to contain a newline must not change meaning. A caller filling a verse has a use for the alignment that a person typing into a box does not.

***

### asBatchEditor?

```ts
optional asBatchEditor?: boolean;
```

Emulate the lyrics panel: the `OneByOne` filler over the selection, NOT following note language. The only path that reads `skipTenuto` and `continueFill`, because it is the only path the app reads them on.

***

### clipUuid?

```ts
optional clipUuid?: string;
```

Clip id, braced. Required with `sentenceIndex`, refused with `noteUuids` (the notes name their own clip).

***

### continueFill?

```ts
optional continueFill?: boolean;
```

Carry on past the addressed notes to the end of the clip. Same default and same precedence as `skipTenuto`.

***

### dryRun?

```ts
optional dryRun?: boolean;
```

Compute the plan and answer it without committing: no undo entry, no note touched.

***

### filler?

```ts
optional filler?: "one-by-one" | "tenuto-standby";
```

Which shipped filler ran. Named as the mechanism argument spells it, because a caller re-issuing a reported combination copies this value straight back.

***

### fillScope?

```ts
optional fillScope?: "target" | "to-clip-end";
```

How far past the addressed notes a fill reaches.

***

### followNoteLanguage?

```ts
optional followNoteLanguage?: boolean;
```

`setShouldFillNoteLang`. Defaults to the filler's own default, true.

***

### followUiPreferences?

```ts
optional followUiPreferences?: boolean;
```

Read `skipTenuto` and `continueFill` from the user's saved lyrics-panel checkboxes when this call does not state them. Nothing here ever WRITES them, so a CLI call cannot quietly reconfigure the app.

***

### fromSentence?

```ts
optional fromSentence?: boolean;
```

Emulate the phrase box over a selection of more than one note: the `TenutoStandby` filler over the target group, following note language. The DEFAULT, and spellable so a script can say what it means.

***

### fromSingleNote?

```ts
optional fromSingleNote?: boolean;
```

Emulate the phrase box over one note: the `OneByOne` filler in single-note mode, spilling forward to the end of the clip and skipping no melismatic notes, following note language.

***

### matchGraphemeLanguage?

```ts
optional matchGraphemeLanguage?: boolean;
```

`setMatchGraphemeLang`. Defaults to the filler's own default, true.

***

### noteUuids?

```ts
optional noteUuids?: string[];
```

Ids of the notes to fill, all in one clip. Under `fromSingleNote` exactly one is allowed.

***

### sentenceIndex?

```ts
optional sentenceIndex?: number;
```

Index of the sentence to fill, 0-based, in the order `clip lyrics` reports.

***

### skipTenuto?

```ts
optional skipTenuto?: boolean;
```

Drop melismatic notes from the target list before filling. Defaults to FALSE whatever the user's saved checkbox holds; `followUiPreferences` opts into the stored value, and an explicit value here wins over it.

***

### text

```ts
text: string;
```

The text to distribute. The input alphabet is the phrase box's: ordinary graphemes, `-` (tenuto), `_` (blank this note), `?` (placeholder), `+` (a possible hyphen inside a polysyllabic word) and `#N` (syllable N of a multi-syllable word, e.g. `paradise#1 paradise#2`). The tenuto, quote and question-mark variants the splitter normalises are accepted anywhere their ASCII form is, and `normalizedText` echoes what the fill actually consumed. An empty string is legal and is the "delete to empty" case — see the header note on empty input.
