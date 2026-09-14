# Interface: PhonemeListResult

Success payload of `phoneme list`.

## Properties

### capabilities

```ts
capabilities: {
  maxVowels?: number;
  supportsVowelSpan: boolean;
};
```

What a write in this group may not exceed, reported so a caller can plan one rather than discover it. Never named per model: model names are published at runtime and supersede one another, so a caller branching on a name would be hardcoding a roster (ADR 0142 §4).

#### maxVowels?

```ts
optional maxVowels?: number;
```

Largest number of vowels a note's vowel span may hold. Absent means unbounded. `phoneme set` refuses a write above it, because nothing bounds the count at edit time and the failure otherwise surfaces as a render error the caller cannot read.

#### supportsVowelSpan

```ts
supportsVowelSpan: boolean;
```

Whether a note may hold more than one vowel — `maxVowels` not being 1, spelled out so the common question needs no arithmetic.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip every row belongs to, in braces format.

***

### filteredRange?

```ts
optional filteredRange?: {
  begin: number;
  end: number;
  scope: "project" | "clip-local";
};
```

The actual tick range `phoneme list` filtered on. Present only when a bound was supplied. Mirrors `clip::FilteredRange` field for field, restated rather than shared for the reason `clip::ClipNoteInput` restates `note::NoteInput`: a struct declared in one group's namespace is that group's, and reaching across would make either group's shape the other's to change.

#### begin

```ts
begin: number;
```

Filter range start, in ticks, in the coordinate system named by `scope`.

#### end

```ts
end: number;
```

Filter range end (exclusive), in the same coordinate system.

#### scope

```ts
scope: "project" | "clip-local";
```

Which coordinate system a tick range is given in. Declared as a roster rather than left a free string so every surface generated off this declaration — the SDK's types, MCP's input schema, a peer reading the contract — carries the two values a caller may send.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint (ADR 0088 §5) over this clip's pronunciation. Carry it into a `phoneme` write to be told (STALE_WRITE) if anything moved in between. This scope moves on a landed synthesis result as well as on a note-content edit, which `clip note-content`'s does not — reading timings because a render just finished is the ordinary path here (ADR 0142 §6).

***

### modelGeneration?

```ts
optional modelGeneration?: string;
```

The vocal synth model generation this clip's track sings through: `v1` or `v2`. Reported, not gated — no verb in this group is withheld by a model. What a generation decides is which representation a write lands in and whether it survives synthesis. Absent when the track carries no voice.

***

### notes

```ts
notes: {
  defaultPhonemes: string[];
  dur: number;
  endSec: number;
  headConsonants: string[];
  isOverride: boolean;
  language: string;
  lyric: string;
  noteUuid: string;
  overrideLegal?: boolean;
  phonemes: string[];
  pos: number;
  startSec: number;
  tailConsonants: string[];
  timingKinds: ("pins" | "consonant-lengths")[];
  timings?: {
     boundaryDraggable?: boolean;
     boundaryMaxSec?: number;
     boundaryMinSec?: number;
     durationSec?: number;
     effectiveDurationSec?: number;
     index: number;
     isPinned: boolean;
     isVowel: boolean;
     name: string;
     spanIndex: number;
     startSec?: number;
  }[];
  vowels: string[];
}[];
```

One row per note in scope, in time order.

#### defaultPhonemes

```ts
defaultPhonemes: string[];
```

What a reset would restore: the note's FROZEN default, resolved once and persisted. A `phoneme g2p` answer can differ from this on a project older than the dictionary — the two reads answer different questions.

#### dur

```ts
dur: number;
```

That note's duration in ticks. A syllable's tail consonants can run past it — `startSec` / `endSec` are the group's extent, which is what the layout actually used as its walls.

#### endSec

```ts
endSec: number;
```

Note-group end in the same base.

#### headConsonants

```ts
headConsonants: string[];
```

The leading consonants alone.

#### isOverride

```ts
isOverride: boolean;
```

Whether `phonemes` is a user's override rather than the derived default.

#### language

```ts
language: string;
```

Full English name of the note's language — what an override is validated against.

#### lyric

```ts
lyric: string;
```

The note's grapheme. `-` marks a tenuto continuing the previous syllable.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces.

#### overrideLegal?

```ts
optional overrideLegal?: boolean;
```

Whether the override is still legal for the note's CURRENT language. Absent when there is no override. A language write re-resolves the default and leaves the override standing, so an override can outlive the language it was legal in, and `phoneme set`'s own validation never sees that note.

#### phonemes

```ts
phonemes: string[];
```

What this note sings: the override if there is one, else the frozen default. In emission order — head consonants, vowel span, tail consonants.

#### pos

```ts
pos: number;
```

The HEAD note's start in clip-local ticks, so a row joins back to `clip note-content` on the note it names.

#### startSec

```ts
startSec: number;
```

Note-group start in the response's time base. The group is head note plus its trailing tenuto notes, which is the span a syllable actually occupies.

#### tailConsonants

```ts
tailConsonants: string[];
```

The trailing consonants alone.

#### timingKinds

```ts
timingKinds: ("pins" | "consonant-lengths")[];
```

Which representations of phoneme timing this note holds. Empty means none. A note can hold both — an old project on a Verse 2.6 track still carrying Verse24 consonant lengths is the ordinary way that happens.

#### timings?

```ts
optional timings?: {
  boundaryDraggable?: boolean;
  boundaryMaxSec?: number;
  boundaryMinSec?: number;
  durationSec?: number;
  effectiveDurationSec?: number;
  index: number;
  isPinned: boolean;
  isVowel: boolean;
  name: string;
  spanIndex: number;
  startSec?: number;
}[];
```

The per-phoneme rows. Present only when `withTimings` was given.

#### vowels

```ts
vowels: string[];
```

The vowel span alone. One contiguous run, always.

***

### spans?

```ts
optional spans?: {
  available: boolean;
  endSec: number;
  index: number;
  kind: "note" | "gap" | "lead-in";
  members: {
     index: number;
     noteUuid: string;
  }[];
  startSec: number;
  unavailableReason?: "not-synthesized" | "partial-span";
}[];
```

The spans the reported notes take part in, in time order. Present only when `withTimings` was given. Computed over the WHOLE clip and then narrowed, because a note's leading consonants are realised in its neighbour's span — a span table built from the filtered notes alone would answer differently depending on what was asked for.

#### available

```ts
available: boolean;
```

Whether the span has geometry. False leaves every member's `startSec` absent.

#### endSec

```ts
endSec: number;
```

Span end in the response's time base.

#### index

```ts
index: number;
```

0-based index in time order. `PhonemeTimingRow.spanIndex` refers to it.

#### kind

```ts
kind: "note" | "gap" | "lead-in";
```

Where a span sits relative to the notes around it.

#### members

```ts
members: {
  index: number;
  noteUuid: string;
}[];
```

Every phoneme realised in this span, in time order. Routinely drawn from two notes.

#### startSec

```ts
startSec: number;
```

Span start in the response's time base. For a lead-in this is where its material actually begins, since it has no wall of its own.

#### unavailableReason?

```ts
optional unavailableReason?: "not-synthesized" | "partial-span";
```

Why a span has no geometry to report.

***

### timeBase

```ts
timeBase: string;
```

What every `startSec`, `endSec` and boundary second on this response is measured from: `clip-local`, seconds from the clip's own origin. Stated once here rather than repeated on every row, and stated at all because a phoneme's leading consonants can start before the clip does, making a negative second an ordinary answer rather than a bug.
