# Interface: RecordingStartResult

Success payload of `recording start`.

## Properties

### armedTracks

```ts
armedTracks: {
  kind: string;
  region: string;
  trackIndex: number;
  trackName: string;
  trackType: string;
}[];
```

Every armed track, and so every candidate for a take. Reported because the arm is derived from the caret rather than passed in, so this is what confirms the call recorded what the caller meant.

#### kind

```ts
kind: string;
```

Which recorder the track feeds: 'audio' for an Audio track, 'midi' for a note track.

#### region

```ts
region: string;
```

Which index space `trackIndex` counts in: `arrangement`, the only region whose tracks this group reaches. Written out rather than implied, so a caller reading a track index anywhere on this surface reads it the same way and needs no table of which groups omit it (ADR 0129 §2).

#### trackIndex

```ts
trackIndex: number;
```

0-based track index (users see tracks numbered from 1).

#### trackName

```ts
trackName: string;
```

The track's display name.

#### trackType

```ts
trackType: string;
```

Track type: Audio, Sing, Instrument, or GenericMidi.

***

### beginSec

```ts
beginSec: number;
```

The same start in seconds, under the current tempo curve. A conversion (`nativeUnit` is `tick`), reported because a take is eventually an audio file and lining one up against video or another recording is wall-clock work. When the transport was already rolling this is the playhead's own seconds put through a tick and back, so it can differ from `transport state`'s `position` by the rounding of that tick — the take really did start on the tick, which is why that is the value reported as exact.

***

### beginTick

```ts
beginTick: number;
```

Tick the take starts at: the caret, or the live playback position when the transport was already rolling.

***

### countIn

```ts
countIn: boolean;
```

True when a count-in is still counting, so nothing is being captured yet.

***

### countInBars

```ts
countInBars: number;
```

Bars of count-in this call will play: the user's preference, or 0 when the transport was already rolling (which skips it).

***

### nativeUnit

```ts
nativeUnit: "tick";
```

The unit a take's start is authoritative in. Always `tick`: the start comes from the caret or the live playback tick, and the recorder is handed a tick (`startRecording(beginTick)`), so the seconds reported beside it are a conversion under the current tempo curve.

***

### recording

```ts
recording: boolean;
```

True once capture (or its count-in) is under way. Recording is a busy state, so other remote writes are refused with USER_BUSY until `recording stop`.
