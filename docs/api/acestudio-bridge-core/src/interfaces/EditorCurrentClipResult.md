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

Clip type: `sing`, `instrument`, `genericMidi`, `audio`, or `chord`.

***

### defaultLanguage?

```ts
optional defaultLanguage?: string;
```

Track default language code (CHN/JPN/ENG/SPA/KOR). Present only for Sing clips.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, `video`, `marker` or `chord`.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of the clip's track in `region` (ADR 0129 §3). Absent together with `region` when the project cannot place the track.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

UUID of the clip's track, in braces (ADR 0129 §2).
