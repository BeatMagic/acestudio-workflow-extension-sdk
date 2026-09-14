# Interface: ClipListResult

Success payload of `clip list`.

## Properties

### clipCount

```ts
clipCount: number;
```

Number of clips returned.

***

### clips

```ts
clips: {
  audioMedia?: {
     clipInSec: number;
     loadingState: string;
     sourceDurationSec: number;
     sourcePath: string;
  };
  clipBegin: number;
  clipBeginSec: number;
  clipColor: string;
  clipEnd: number;
  clipEndSec: number;
  clipName: string;
  clipType: string;
  clipUuid: string;
  enabled: boolean;
  nativeUnit: "tick" | "second";
  noteCount?: number;
  videoMedia?: {
     clipInSec: number;
     hasAudio: boolean;
     libraryAsset?: {
        kind: string;
        stableId: string;
     };
     muted: boolean;
     sourceDurationSec: number;
     sourcePath: string;
  };
}[];
```

Clips on the track, in track order.

#### audioMedia?

```ts
optional audioMedia?: {
  clipInSec: number;
  loadingState: string;
  sourceDurationSec: number;
  sourcePath: string;
};
```

The media an Audio clip points at — the counterpart [`ClipVideoMedia`] gives a Video clip: which file it plays, whether that file has loaded, and how its visible region is trimmed out of the source. Not every `ClipVideoMedia` field has a counterpart here: `muted` and `hasAudio` are video-specific concepts (an audio clip's silence is its gain and its `enabled` flag, not a detached-embedded-audio state), and `libraryAsset` has no audio counterpart at all — an audio clip never carries a Library asset reference: the MV drop resolves the active version once and binds a plain file, so there is no `stableId` for a caller to map back to.

##### audioMedia.clipInSec

```ts
clipInSec: number;
```

The clip's *clip in*: the offset into the SOURCE MEDIA at which the visible region starts — the head trimmed off. SECONDS ONLY, for the reason [`ClipVideoMedia`]'s `clipInSec` gives (ADR 0069 §1). 0 for an untrimmed clip, and when no source window is knowable (a streaming clip before its download commits a local file, or a clip whose source length has not been established). Read off the clip's stored source window, because a warp-following audio clip's Second geometry is OUTPUT seconds under the map (ADR 0117 §6); a clip playing at its native rate falls back to the visible region's source-seconds offset, where output-local seconds ARE source seconds.

##### audioMedia.loadingState

```ts
loadingState: string;
```

Audio load state: `not_loaded`, `loaded_success`, or `loaded_failed` — the same value `clip audio-content` reports, out of the same mapping. Reported here so a caller mirroring a timeline learns that a clip's media has loaded from the same call that enumerates it, rather than one `clip audio-content` per clip.

##### audioMedia.sourceDurationSec

```ts
sourceDurationSec: number;
```

The source file's own length in seconds, on the source-media axis — not the clip's editable canvas, which a remote audio import may grow past the source, and not the clip's visible duration, which a warp-following clip reports as OUTPUT seconds under the map (ADR 0117 §6). 0 when no source length is known: a source that has not yielded decoded audio yet, or a stream that has not finished buffering. Read off the warp model's recorded length for a warp-following clip, and off the audio backend's decoded length for a native-rate one (fresher than the model's record after a sample replacement), where output-local seconds ARE source seconds.

##### audioMedia.sourcePath

```ts
sourcePath: string;
```

Absolute path to the backing audio file — the file a caller must open to work on the media. Unlike `clip audio-content`'s `audioFileName`, nothing is truncated for privacy: this is the path, as [`ClipVideoMedia`] reports it. EMPTY when the clip's source did not resolve (an MV audio drop whose asset was unavailable when it landed): the clip is then unavailable rather than pathless, so an empty path is a state to handle, not a malformed result. A streaming clip reports its stream URL until the download commits a local file.

#### clipBegin

```ts
clipBegin: number;
```

Visible region start on the global timeline, in ticks.

#### clipBeginSec

```ts
clipBeginSec: number;
```

`clipBegin` in seconds.

#### clipColor

```ts
clipColor: string;
```

Resolved hex color, upper-case with leading '#'.

#### clipEnd

```ts
clipEnd: number;
```

Visible region end on the global timeline, in ticks.

#### clipEndSec

```ts
clipEndSec: number;
```

`clipEnd` in seconds.

#### clipName

```ts
clipName: string;
```

Display name (auto-generated when no raw name is set).

#### clipType

```ts
clipType: string;
```

Clip type: `sing`, `instrument`, `genericMidi`, `audio`, `chord`, `video`, or `marker`.

#### clipUuid

```ts
clipUuid: string;
```

Stable clip UUID, with braces. Every id-taking clip write takes it — `clip move`, `clip resize`, `clip delete`.

#### enabled

```ts
enabled: boolean;
```

Whether the clip is enabled. A disabled clip is skipped at playback and export; an enabled one still goes silent under a track mute or another track's solo, so this is the clip's own switch, not final audibility. Reported per row so a caller learns which clips are live from the same call that enumerates them, rather than one `clip get` per clip. That matters for the question this answers most often: whether any MIDI-like track holds an enabled clip, which decides whether a tempo sync would de-align content that owns the current grid. Mute is a different question and does not appear here — muted content still owns the grid.

#### nativeUnit

```ts
nativeUnit: "tick" | "second";
```

Which unit an entity's geometry is stored in — the one value that is exact, with the other reported beside it as a conversion under the current tempo curve (ADR 0032 §2-4). Declared here because every group that reports geometry names it. It follows the entity's own anchoring, which `PatternFactory::preferredGeometryTimeUnit` is the source of truth for: media that plays at wall-clock speed is second-native, content written against the grid is tick-native.

#### noteCount?

```ts
optional noteCount?: number;
```

Visible note count. Present only for note-based clips (Sing/Instrument/GenericMidi); absent for Audio and Chord.

#### videoMedia?

```ts
optional videoMedia?: {
  clipInSec: number;
  hasAudio: boolean;
  libraryAsset?: {
     kind: string;
     stableId: string;
  };
  muted: boolean;
  sourceDurationSec: number;
  sourcePath: string;
};
```

The media a Video clip points at — the half of a clip's identity its geometry does not carry: which file it shows, which Library asset it references, whether its embedded audio is silent, and how its visible region is trimmed out of the source. On `clip list`'s rows as well as `clip get`, so a caller mirroring the timeline does not need one `clip get` per clip. A still image is placed as a Video clip.

##### videoMedia.clipInSec

```ts
clipInSec: number;
```

The clip's *clip in*: the offset into the SOURCE MEDIA at which the visible region starts — the head trimmed off. SECONDS ONLY, deliberately: clip in lives on the source-media axis, which is not on the tempo grid, so it has no meaningful tick representation (ADR 0069 §1) — unlike a timeline position, which is reported in whichever unit was asked for. 0 for an untrimmed clip.

##### videoMedia.hasAudio

```ts
hasAudio: boolean;
```

Whether the clip's source carries an audio stream at all — false for a still image, and for a video with no audio track. Filled when the clip is loaded into the audio graph, so it reads false for a clip this session has never played or composited; treat a false as "no audio known yet" rather than as proof the file is silent.

##### videoMedia.libraryAsset?

```ts
optional libraryAsset?: {
  kind: string;
  stableId: string;
};
```

A clip's Library asset reference (#576): the immutable handle a Library-backed clip binds. Carried wherever a clip is reported — the MV snapshot's `VideoClip` and the `clip` reads' `ClipVideoMedia` — so a consumer can recognize which clips are its own Library assets, and which asset each maps to, rather than only seeing a resolved file path. Studio resolves the active version from the active-version map, and the resolved file is reported beside this handle rather than in place of it.

##### videoMedia.libraryAsset.kind

```ts
kind: string;
```

Asset kind (`video`, `image`, or `audio`).

##### videoMedia.libraryAsset.stableId

```ts
stableId: string;
```

Immutable handle of the referenced asset — the active-version map key.

##### videoMedia.muted

```ts
muted: boolean;
```

Whether the clip's EMBEDDED AUDIO is silenced while its video keeps playing. The same flag `clip set-muted` writes and echoes back: Studio's "detached" state, one concept with two surfaces (ADR 0069 §3). So a clip whose audio the user detached (Detach Audio) also reads muted — correct, its embedded audio IS silent. Distinct from `enabled`, which switches the whole clip: video hidden AND audio silent.

##### videoMedia.sourceDurationSec

```ts
sourceDurationSec: number;
```

The source media's own full duration in seconds — the clip's canvas length. It bounds any trim (`clipInSec` + the visible duration never exceeds it), and what is left over is the tail bleed a resize can still pull back (ADR 0069 §2). For an image clip, which has no intrinsic timeline, this mirrors the placed duration instead.

##### videoMedia.sourcePath

```ts
sourcePath: string;
```

Absolute path to the backing video or image file. For a Library asset reference this is the version Studio resolved from the active-version map, and it is EMPTY when the map could not resolve one (an unresolved reference — e.g. a project opened away from its Library): the clip is then unavailable rather than pathless, so an empty path is a state to handle, not a malformed result. Reported beside `libraryAsset` rather than instead of it, because it is the file a caller must open to work on the media.
