# Interface: TrackListResult

Success payload of `track list`.

## Properties

### contentTrackCount

```ts
contentTrackCount: number;
```

Number of content (non-empty-slot) tracks in the project; the length of `tracks`.

***

### tracks

```ts
tracks: {
  clipCount: number;
  soundSourceName?: string;
  trackIndex: number;
  trackName: string;
  trackType: string;
  trackUuid: string;
}[];
```

All content tracks, in arrangement order.

#### clipCount

```ts
clipCount: number;
```

Number of clips (patterns) on the track.

#### soundSourceName?

```ts
optional soundSourceName?: string;
```

Sound-source name for note tracks; 'N-member choir'/'N-member ensemble' in choir/ensemble mode; empty for GenericMidi; omitted for Audio tracks.

#### trackIndex

```ts
trackIndex: number;
```

0-based position in the arrangement.

#### trackName

```ts
trackName: string;
```

Current display name.

#### trackType

```ts
trackType: string;
```

One of: Sing, Instrument, GenericMidi, Audio, Unknown.

#### trackUuid

```ts
trackUuid: string;
```

Track UUID in braces format.
