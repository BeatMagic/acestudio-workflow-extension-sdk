# Interface: TrackSetLanguageParams

Arguments for `track set-language`.

## Properties

### language

```ts
language: string;
```

Default lyric language for notes added later, as a full English name (e.g. `Chinese`). `track get` reports the current value as `defaultLanguage`, and the singer's `supportedLanguages` is the set to choose from. Existing notes keep the language they were written with.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement`, this operation's default, can hold a Sing track, so it is the only region an index may count in here — another one is refused with that reason rather than read as a layer that cannot hold what this verb writes. Ignored beside `trackUuid`, which needs no region. Declared even though it is a constant, so a client writing generic code over anything carrying a `trackIndex` needs no table of exempt operations (ADR 0129 §2).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format.
