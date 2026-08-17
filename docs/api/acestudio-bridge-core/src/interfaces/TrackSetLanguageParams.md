# Interface: TrackSetLanguageParams

Arguments for `track set-language`.

## Properties

### language

```ts
language: string;
```

Default lyric language for notes added later, as a full English name (e.g. `Chinese`). `track get` reports the current value as `defaultLanguage`, and the singer's `supportedLanguages` is the set to choose from. Existing notes keep the language they were written with.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format.
