# Interface: GenerativeVocal2midiParams

Arguments for `generative vocal2midi`.

## Properties

### applyPitch?

```ts
optional applyPitch?: boolean | null;
```

Carry the source's pitch curve onto the transcribed notes, not just their pitches. On by default, matching the dialog's checkbox.

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

Which language the vocal is in. **Required** -- the service offers no "detect it" option, and the dialog's own initial value is whatever was picked last, which is not a default a script may inherit. Use `notes-only` for a melody with no words to transcribe.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

The Sing track the transcribed notes land on. Omit to insert a new Sing track directly below the source clip's track, as the UI does.
