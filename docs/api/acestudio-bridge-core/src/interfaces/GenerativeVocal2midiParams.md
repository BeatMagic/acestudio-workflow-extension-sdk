# Interface: GenerativeVocal2midiParams

Arguments for `generative vocal2midi`.

## Properties

### applyPitch?

```ts
optional applyPitch?: boolean;
```

Carry the source's pitch curve onto the transcribed notes, not just their pitches. On by default.

***

### clipUuid

```ts
clipUuid: string;
```

The audio clip to transcribe, by id. Required.

***

### language

```ts
language: 
  | "chinese"
  | "english"
  | "japanese"
  | "spanish"
  | "korean"
  | "french"
  | "italian"
  | "portuguese"
  | "notes-only";
```

Which language the vocal transcription assumes, matching `Vocal2Midi::Vocal2MidiOption` one for one. There is deliberately **no `auto`**: the service has no such option. The dialog's initial value is whatever the user chose last, which is exactly the kind of "depends on what happened before" default a remote call must not inherit (ADR 0087), so `language` is required rather than defaulted. `notes-only` is the service's `Note` option: transcribe pitches and rhythm and attach no lyrics at all. It is the right answer for a non-vocal melody, and the only value that does not need a language guessed.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

The Sing track the transcribed notes land on. Omit to insert a new Sing track directly below the source clip's track, as the UI does.
