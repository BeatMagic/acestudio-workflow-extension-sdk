# Interface: EditorCurrentClipResult

Success payload of `editor current-clip`.

## Properties

### clipIndex

```ts
clipIndex: number;
```

0-based index of the clip within its track.

***

### clipName

```ts
clipName: string;
```

Display name of the clip.

***

### clipType

```ts
clipType: string;
```

Clip type: Sing, Instrument, GenericMidi, Audio, or Chord.

***

### defaultLanguage?

```ts
optional defaultLanguage?: string;
```

Track default language code (CHN/JPN/ENG/SPA/KOR). Present only for Sing clips.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the clip's track in the project.
