# Interface: ImportFileResult

Success payload of `import file`.

## Properties

### clipCount?

```ts
optional clipCount?: number;
```

Project kinds only: how many clips were placed and are addressable in `clips`.

***

### clipName?

```ts
optional clipName?: string;
```

Media kinds only: display name of the placed clip.

***

### clips?

```ts
optional clips?: Record<string, unknown>[];
```

Project kinds only: one row per placed clip, each with clipUuid / clipType / clipName / geometry. A MIDI file with four tracks yields four rows.

***

### clipType?

```ts
optional clipType?: string;
```

Media kinds only: clip type the extension resolved to, 'audio' or 'video' (a still image becomes a Video clip).

***

### clipUuid?

```ts
optional clipUuid?: string;
```

Media kinds only: id of the placed clip -- the handle every later clip write takes.

***

### geometry?

```ts
optional geometry?: Record<string, unknown>;
```

Media kinds only: the placed clip's geometry, in ticks -- the same shape `clip get` reports, so `end` can be read rather than computed.

***

### loadingState?

```ts
optional loadingState?: string;
```

Audio clips only: 'not_loaded', 'loaded_success' or 'loaded_failed'. Usually 'not_loaded' -- decoding continues after this command returns. Poll `clip audio-content` and compare its fingerprint to see it settle.

***

### naturalDur?

```ts
optional naturalDur?: number;
```

Media kinds only: the source's own length in ticks, before any --clip-in / --dur window was applied. Compare with geometry to see how much of the file is showing.

***

### sourceFormat?

```ts
optional sourceFormat?: string;
```

Project kinds only: 'midi', 'musicxml' or 'ufdata'. Its presence is what distinguishes the two output shapes.

***

### sourcePath

```ts
sourcePath: string;
```

The path that was imported, echoed back unchanged. The only field both shapes carry.

***

### tempoImported?

```ts
optional tempoImported?: boolean;
```

Project kinds only: whether the source's tempo map was applied to the project (echoes --with-tempo, default false).

***

### timeSignaturesImported?

```ts
optional timeSignaturesImported?: boolean;
```

Project kinds only: whether the source's time signatures were applied (echoes --with-time-signatures, default false).

***

### trackCount?

```ts
optional trackCount?: number;
```

Project kinds only: how many tracks the source file held. Larger than clipCount only if a placed clip could not be identified afterwards.

***

### trackName?

```ts
optional trackName?: string;
```

Media kinds only: name of the track the clip landed on, which may be one this command created.
