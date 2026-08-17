# Interface: EditorStatusResult

Success payload of `editor status`.

## Properties

### clipIndex?

```ts
optional clipIndex?: number;
```

0-based index of the clip within its track. Present only when the clip is found on a pattern track.

***

### clipName?

```ts
optional clipName?: string;
```

Display name of the current clip. Present only when a clip is loaded.

***

### clipUuid?

```ts
optional clipUuid?: string;
```

UUID (with braces) of the current clip. Present only when a clip is loaded.

***

### defaultArticulation?

```ts
optional defaultArticulation?: string;
```

Display name of the track's default articulation. Present only for Instrument clips.

***

### defaultLanguage?

```ts
optional defaultLanguage?: string;
```

Track default language as an English full name (e.g. Chinese). Present only for Sing clips.

***

### editorType?

```ts
optional editorType?: string;
```

Clip type of the active editor: Sing, Instrument, GenericMidi, Audio, or Chord. Present only when a clip is loaded.

***

### isAvailable

```ts
isAvailable: boolean;
```

Whether a pattern editor has valid content loaded. When false, every clip-context field below is absent.

***

### isVisible

```ts
isVisible: boolean;
```

Whether the editor window is currently shown.

***

### supportedArticulations?

```ts
optional supportedArticulations?: string[];
```

Articulation display names supported by the whole ensemble. Present only for Instrument clips.

***

### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Languages supported by the whole choir, as English full names. Present only for Sing clips.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index of the clip's track. Present only when the track is found in the project.
