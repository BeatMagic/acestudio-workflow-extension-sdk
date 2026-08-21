# Interface: ImportFileResult

Success payload of `import file`.

## Properties

### clipCount?

```ts
optional clipCount?: number;
```

Foreign-project kinds only: how many clips were placed and are addressable in `clips`.

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

Foreign-project kinds only: one row per placed clip, each an open map — this surface declares no fixed key set for an entry. A MIDI file with four tracks yields four rows.

***

### clipType?

```ts
optional clipType?: string;
```

Media kinds only: clip type the extension resolved to, `audio` or `video` (a still image becomes a Video clip).

***

### clipUuid?

```ts
optional clipUuid?: string;
```

Media kinds only: id of the placed clip — the handle every later clip write takes.

***

### createdTrack?

```ts
optional createdTrack?: boolean;
```

Media kinds only: whether this call created the track the clip landed on, rather than placing it on one that already existed. Two ways it becomes true: the region had no track to place on, or the target span was occupied and the clip was bumped to a fresh track above it. Neither is predictable from the arguments.

***

### geometry?

```ts
optional geometry?: Record<string, unknown>;
```

Media kinds only: the placed clip's geometry — the same shape `clipRow` reports, in both units, with `nativeUnit` naming the exact one. An open map here: this surface declares no fixed key set for it.

***

### loadingState?

```ts
optional loadingState?: string;
```

Audio clips only: `not_loaded`, `loaded_success` or `loaded_failed`. Usually `not_loaded` — decoding continues after this call returns. Poll `clip audio-content` and compare its fingerprint to see it settle.

***

### naturalDur?

```ts
optional naturalDur?: number;
```

Media kinds only: the source's own length in ticks, before any `clipIn` / `dur` window was applied, measured at the position the clip landed on — the same axis `dur` is on, so a caller can size a window from it. Compare with `geometry` to see how much of the file is showing. A converted, rounded value: a media source is measured in seconds, so its tick length depends on the tempo where the clip landed. Read `naturalDurSec` for the file's own length (ADR 0032 §2).

***

### naturalDurSec?

```ts
optional naturalDurSec?: number;
```

Media kinds only: the same source length in seconds — the file's own measurement, exact and independent of the tempo curve. This is the native unit for every kind this field describes, audio and video alike.

***

### region?

```ts
optional region?: string;
```

Media kinds only: which index space `trackIndex` counts in — `arrangement` or `video`. Travels with `trackIndex` (ADR 0129 §2): a video layer's index is region-local, so the number alone would read as an arrangement position.

***

### sourceFormat?

```ts
optional sourceFormat?: string;
```

Foreign-project kinds only: `midi`, `musicxml` or `ufdata`. Its presence is what distinguishes the two output shapes.

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

Foreign-project kinds only: whether the source's tempo map was applied to the project (echoes `withTempo`, default false).

***

### timeSignaturesImported?

```ts
optional timeSignaturesImported?: boolean;
```

Foreign-project kinds only: whether the source's time signatures were applied (echoes `withTimeSignatures`, default false).

***

### trackCount?

```ts
optional trackCount?: number;
```

Foreign-project kinds only: how many tracks the source file held. Larger than `clipCount` only if a placed clip could not be identified afterwards.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

Media kinds only: 0-based position of that track in `region` — the identity the UI shows a person, beside the handle a program stores (ADR 0129 §3). Where the clip actually landed, which `onOccupied: relocate` can make differ from what was asked for.

***

### trackName?

```ts
optional trackName?: string;
```

Media kinds only: name of the track the clip landed on, which may be one this command created.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Media kinds only: id of the track the clip landed on — the handle a later track write takes. Not derivable from `trackName`, which is a display string and not unique.
