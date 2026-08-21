# Interface: RecordingStopResult

Success payload of `recording stop`.

## Properties

### countInCancelled

```ts
countInCancelled: boolean;
```

True when the call only cancelled a count-in: capture had not begun, so no take landed and no undo entry was pushed.

***

### recording

```ts
recording: boolean;
```

False after a successful stop. Reported so a caller can confirm the busy window closed.

***

### takes

```ts
takes: {
  kind: string;
  path?: string;
  region: string;
  trackIndex: number;
  trackName: string;
  trackType: string;
}[];
```

The takes this call landed, one per recording track. Together they form the single attributed undo entry.

#### kind

```ts
kind: string;
```

Which recorder the track feeds: 'audio' for an Audio track, 'midi' for a note track.

#### path?

```ts
optional path?: string;
```

Absolute path of the recorded wav inside the project's Samples folder. Audio takes only.

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
