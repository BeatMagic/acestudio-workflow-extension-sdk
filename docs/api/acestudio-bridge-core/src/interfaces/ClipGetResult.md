# Interface: ClipGetResult

Success payload of `clip get`.

## Properties

### audioMedia?

```ts
optional audioMedia?: {
  clipInSec: number;
  loadingState: string;
  sourceDurationSec: number;
  sourcePath: string;
};
```

The media an Audio clip points at — the counterpart [`ClipVideoMedia`] gives a Video clip: which file it plays, whether that file has loaded, and how its visible region is trimmed out of the source. Not every `ClipVideoMedia` field has a counterpart here: `muted` and `hasAudio` are video-specific concepts (an audio clip's silence is its gain and its `enabled` flag, not a detached-embedded-audio state), and `libraryAsset` has no audio counterpart at all — an audio clip never carries a Library asset reference: the MV drop resolves the active version once and binds a plain file, so there is no `stableId` for a caller to map back to.

#### clipInSec

```ts
clipInSec: number;
```

The clip's *clip in*: the offset into the SOURCE MEDIA at which the visible region starts — the head trimmed off. SECONDS ONLY, for the reason [`ClipVideoMedia`]'s `clipInSec` gives (ADR 0069 §1). 0 for an untrimmed clip, and when no source window is knowable (a streaming clip before its download commits a local file, or a clip whose source length has not been established). Read off the clip's stored source window, because a warp-following audio clip's Second geometry is OUTPUT seconds under the map (ADR 0117 §6); a clip playing at its native rate falls back to the visible region's source-seconds offset, where output-local seconds ARE source seconds.

#### loadingState

```ts
loadingState: string;
```

Audio load state: `not_loaded`, `loaded_success`, or `loaded_failed` — the same value `clip audio-content` reports, out of the same mapping. Reported here so a caller mirroring a timeline learns that a clip's media has loaded from the same call that enumerates it, rather than one `clip audio-content` per clip.

#### sourceDurationSec

```ts
sourceDurationSec: number;
```

The source file's own length in seconds, on the source-media axis — not the clip's editable canvas, which a remote audio import may grow past the source, and not the clip's visible duration, which a warp-following clip reports as OUTPUT seconds under the map (ADR 0117 §6). 0 when no source length is known: a source that has not yielded decoded audio yet, or a stream that has not finished buffering. Read off the warp model's recorded length for a warp-following clip, and off the audio backend's decoded length for a native-rate one (fresher than the model's record after a sample replacement), where output-local seconds ARE source seconds.

#### sourcePath

```ts
sourcePath: string;
```

Absolute path to the backing audio file — the file a caller must open to work on the media. Unlike `clip audio-content`'s `audioFileName`, nothing is truncated for privacy: this is the path, as [`ClipVideoMedia`] reports it. EMPTY when the clip's source did not resolve (an MV audio drop whose asset was unavailable when it landed): the clip is then unavailable rather than pathless, so an empty path is a state to handle, not a malformed result. A streaming clip reports its stream URL until the download commits a local file.

***

### clipName

```ts
clipName: string;
```

Display name (auto-generated when no raw name is set).

***

### clipType

```ts
clipType: string;
```

Clip type: `sing`, `instrument`, `genericMidi`, `audio`, `chord`, `video`, or `marker` — the same vocabulary `clip list` reports.

***

### clipUuid

```ts
clipUuid: string;
```

Stable clip UUID, with braces.

***

### color

```ts
color: string;
```

Resolved hex color, upper-case with leading '#'.

***

### enabled

```ts
enabled: boolean;
```

Whether the clip is enabled. The clip's own switch: a disabled clip is skipped at playback and export, and an enabled one still goes silent under a track mute or another track's solo.

***

### gain?

```ts
optional gain?: number;
```

Clip gain in decibels: `0` is unity and negative values attenuate. The domain is the audio-clip gain range, -70 to +30 (`AudioGainConstantConfig::LEVEL_MIN` … `LEVEL_MAX`) — the range the clip's own gain control drags through, wider than a track's -70 to +6. The same value `clip set-gain` writes, so it round-trips through that write unchanged. Present only for the two clip types `clip set-gain` accepts (Audio and Video).

***

### geometry

```ts
geometry: {
  clipBegin: number;
  clipBeginSec: number;
  clipBeginTick: number;
  clipDur: number;
  clipDurSec: number;
  clipDurTick: number;
  clipEnd: number;
  clipEndSec: number;
  clipEndTick: number;
  clipPos: number;
  clipPosSec: number;
  clipPosTick: number;
  dur: number;
  durSec: number;
  durTick: number;
  end: number;
  endSec: number;
  endTick: number;
  nativeUnit: "tick" | "second";
  pos: number;
  posSec: number;
  posTick: number;
};
```

A clip's geometry in the *entity* vocabulary, as `clip get` reports it, in whichever unit `usedTimeUnit` names. `pos`/`dur`/`end` are the whole editable region — for a media clip, its source — and the visible region is the four `clip*` fields. A write reports [`ClipWriteGeometry`] instead, which names the visible region a write's own arguments address.

#### clipBegin

```ts
clipBegin: number;
```

Visible region start on the global timeline, in the unit `usedTimeUnit` names. DEPRECATED — see `pos`.

#### clipBeginSec

```ts
clipBeginSec: number;
```

Visible region start on the global timeline, in seconds.

#### clipBeginTick

```ts
clipBeginTick: number;
```

Visible region start on the global timeline, in ticks.

#### clipDur

```ts
clipDur: number;
```

Duration of the visible (clipped) region, in the unit `usedTimeUnit` names. DEPRECATED — see `pos`.

#### clipDurSec

```ts
clipDurSec: number;
```

Duration of the visible region, in seconds.

#### clipDurTick

```ts
clipDurTick: number;
```

Duration of the visible region, in ticks.

#### clipEnd

```ts
clipEnd: number;
```

Visible region end on the global timeline, in the unit `usedTimeUnit` names. DEPRECATED — see `pos`.

#### clipEndSec

```ts
clipEndSec: number;
```

Visible region end on the global timeline, in seconds.

#### clipEndTick

```ts
clipEndTick: number;
```

Visible region end on the global timeline, in ticks.

#### clipPos

```ts
clipPos: number;
```

Start of the visible (clipped) region, pattern-local, in the unit `usedTimeUnit` names. DEPRECATED — see `pos`.

#### clipPosSec

```ts
clipPosSec: number;
```

Start of the visible region, pattern-local, in seconds.

#### clipPosTick

```ts
clipPosTick: number;
```

Start of the visible region, pattern-local, in ticks.

#### dur

```ts
dur: number;
```

Full pattern duration, including trimmed-away regions, in the unit `usedTimeUnit` names. DEPRECATED — see `pos`.

#### durSec

```ts
durSec: number;
```

Full pattern duration including trimmed-away regions, in seconds.

#### durTick

```ts
durTick: number;
```

Full pattern duration including trimmed-away regions, in ticks.

#### end

```ts
end: number;
```

Pattern end on the global timeline (pos + dur), in the unit `usedTimeUnit` names. DEPRECATED — see `pos`.

#### endSec

```ts
endSec: number;
```

Pattern end on the global timeline, in seconds.

#### endTick

```ts
endTick: number;
```

Pattern end on the global timeline, in ticks.

#### nativeUnit

```ts
nativeUnit: "tick" | "second";
```

Which unit an entity's geometry is stored in — the one value that is exact, with the other reported beside it as a conversion under the current tempo curve (ADR 0032 §2-4). Declared here because every group that reports geometry names it. It follows the entity's own anchoring, which `PatternFactory::preferredGeometryTimeUnit` is the source of truth for: media that plays at wall-clock speed is second-native, content written against the grid is tick-native.

#### pos

```ts
pos: number;
```

Pattern start on the global timeline, in the unit `usedTimeUnit` names. DEPRECATED in favour of `posTick` / `posSec`, which say what they are. A caller reading this has to consult `usedTimeUnit` to know what it got, and a caller that forgets reads seconds as ticks. Kept because removing it is a breaking change; every field below is unambiguous.

#### posSec

```ts
posSec: number;
```

Pattern start on the global timeline, in seconds. Always seconds, whatever `usedTimeUnit` says.

#### posTick

```ts
posTick: number;
```

Pattern start on the global timeline, in ticks. Always ticks, whatever `usedTimeUnit` says.

***

### isColorLinkToTrack

```ts
isColorLinkToTrack: boolean;
```

Whether the clip color follows the track color.

***

### rawName

```ts
rawName: string;
```

User-supplied name; empty string when the display name is auto-generated.

***

### usedTimeUnit

```ts
usedTimeUnit: string;
```

Which unit the DEPRECATED `geometry.pos`/`dur`/... fields are denominated in for this call: `tick`, `second`, `tick (not native)`, or `second (not native)`. DEPRECATED with them. `geometry.nativeUnit` answers "which value is exact" as a typed field, and the `*Tick` / `*Sec` pairs are unambiguous without consulting anything, so neither this nor `preferredTimeUnit` has a job left. The `(not native)` suffix is still emitted, deliberately: dropping it would change the value of a field callers already parse. Read `geometry.nativeUnit` for that fact instead; the suffix goes when this field does.

***

### videoMedia?

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

#### clipInSec

```ts
clipInSec: number;
```

The clip's *clip in*: the offset into the SOURCE MEDIA at which the visible region starts — the head trimmed off. SECONDS ONLY, deliberately: clip in lives on the source-media axis, which is not on the tempo grid, so it has no meaningful tick representation (ADR 0069 §1) — unlike a timeline position, which is reported in whichever unit was asked for. 0 for an untrimmed clip.

#### hasAudio

```ts
hasAudio: boolean;
```

Whether the clip's source carries an audio stream at all — false for a still image, and for a video with no audio track. Filled when the clip is loaded into the audio graph, so it reads false for a clip this session has never played or composited; treat a false as "no audio known yet" rather than as proof the file is silent.

#### libraryAsset?

```ts
optional libraryAsset?: {
  kind: string;
  stableId: string;
};
```

A clip's Library asset reference (#576): the immutable handle a Library-backed clip binds. Carried wherever a clip is reported — the MV snapshot's `VideoClip` and the `clip` reads' `ClipVideoMedia` — so a consumer can recognize which clips are its own Library assets, and which asset each maps to, rather than only seeing a resolved file path. Studio resolves the active version from the active-version map, and the resolved file is reported beside this handle rather than in place of it.

##### libraryAsset.kind

```ts
kind: string;
```

Asset kind (`video`, `image`, or `audio`).

##### libraryAsset.stableId

```ts
stableId: string;
```

Immutable handle of the referenced asset — the active-version map key.

#### muted

```ts
muted: boolean;
```

Whether the clip's EMBEDDED AUDIO is silenced while its video keeps playing. The same flag `clip set-muted` writes and echoes back: Studio's "detached" state, one concept with two surfaces (ADR 0069 §3). So a clip whose audio the user detached (Detach Audio) also reads muted — correct, its embedded audio IS silent. Distinct from `enabled`, which switches the whole clip: video hidden AND audio silent.

#### sourceDurationSec

```ts
sourceDurationSec: number;
```

The source media's own full duration in seconds — the clip's canvas length. It bounds any trim (`clipInSec` + the visible duration never exceeds it), and what is left over is the tail bleed a resize can still pull back (ADR 0069 §2). For an image clip, which has no intrinsic timeline, this mirrors the placed duration instead.

#### sourcePath

```ts
sourcePath: string;
```

Absolute path to the backing video or image file. For a Library asset reference this is the version Studio resolved from the active-version map, and it is EMPTY when the map could not resolve one (an unresolved reference — e.g. a project opened away from its Library): the clip is then unavailable rather than pathless, so an empty path is a state to handle, not a malformed result. Reported beside `libraryAsset` rather than instead of it, because it is the file a caller must open to work on the media.
