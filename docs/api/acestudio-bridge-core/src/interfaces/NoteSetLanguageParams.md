# Interface: NoteSetLanguageParams

Arguments for `note set-language`.

## Properties

### language

```ts
language: string;
```

The target language: `CHN`, `JPN`, `ENG`, `SPA`, or `KOR`.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the Sing notes to change, from `clip note-content`. All must be in the same clip.
