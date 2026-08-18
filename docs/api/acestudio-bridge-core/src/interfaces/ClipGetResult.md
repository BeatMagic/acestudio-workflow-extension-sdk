# Interface: ClipGetResult

Success payload of `clip get`.

## Properties

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

### geometry

```ts
geometry: {
  clipBegin: number;
  clipDur: number;
  clipEnd: number;
  clipPos: number;
  dur: number;
  end: number;
  pos: number;
};
```

A clip's geometry in the *entity* vocabulary, as `clip get` reports it, in whichever unit `usedTimeUnit` names. `pos`/`dur`/`end` are the whole editable region — for a media clip, its source — and the visible region is the four `clip*` fields. A write reports [`ClipWriteGeometry`] instead, which names the visible region a write's own arguments address.

#### clipBegin

```ts
clipBegin: number;
```

Visible region start on the global timeline.

#### clipDur

```ts
clipDur: number;
```

Duration of the visible (clipped) region.

#### clipEnd

```ts
clipEnd: number;
```

Visible region end on the global timeline.

#### clipPos

```ts
clipPos: number;
```

Start of the visible (clipped) region, pattern-local.

#### dur

```ts
dur: number;
```

Full pattern duration, including trimmed-away regions.

#### end

```ts
end: number;
```

Pattern end on the global timeline (pos + dur).

#### pos

```ts
pos: number;
```

Pattern start on the global timeline.

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

Time unit of the geometry values: `tick`, `second`, `tick (not native)`, or `second (not native)`.

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

The media a clip points at — the half of a clip's identity its geometry does not carry: which file it shows, which Library asset it references, whether its embedded audio is silent, and how its visible region is trimmed out of the source. Reported by BOTH `clip list` (per row) and `clip get`, out of one producer, so the two reads cannot answer differently about the same clip. On the row for the reason `enabled` is: a caller mirroring the timeline needs the media of every clip it enumerates, and per-clip media would make that one `clip get` per clip. Present only for a clip that HAS media, the way `noteCount` is present only for a note-based one — today that means a Video clip (which is also how a still image is placed). An Audio clip's file and load state are `clip audio-content`'s answer and are not restated here. Every field is present whenever the struct itself is: each is read straight off the clip, which always has an answer, so there is no "carried by a newer writer only" tier inside it.

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
