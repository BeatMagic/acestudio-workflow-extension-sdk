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
  clipBegin: number;
  clipColor: string;
  clipEnd: number;
  clipName: string;
  clipType: string;
  clipUuid: string;
  enabled: boolean;
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

#### clipBegin

```ts
clipBegin: number;
```

Visible region start on the global timeline, in ticks.

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

The media a clip points at — the half of a clip's identity its geometry does not carry: which file it shows, which Library asset it references, whether its embedded audio is silent, and how its visible region is trimmed out of the source. Reported by BOTH `clip list` (per row) and `clip get`, out of one producer, so the two reads cannot answer differently about the same clip. On the row for the reason `enabled` is: a caller mirroring the timeline needs the media of every clip it enumerates, and per-clip media would make that one `clip get` per clip. Present only for a clip that HAS media, the way `noteCount` is present only for a note-based one — today that means a Video clip (which is also how a still image is placed). An Audio clip's file and load state are `clip audio-content`'s answer and are not restated here. Every field is present whenever the struct itself is: each is read straight off the clip, which always has an answer, so there is no "carried by a newer writer only" tier inside it.

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
