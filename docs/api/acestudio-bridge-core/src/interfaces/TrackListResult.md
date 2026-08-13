# Interface: TrackListResult

Success payload of `track list`.

## Properties

### contentTrackCount

```ts
contentTrackCount: number;
```

The length of `tracks` — the arrangement's content (non-empty-slot) track count when no `type` filter narrows it.

***

### tracks

```ts
tracks: {
  clipCount: number;
  region: string;
  soundSourceName?: string;
  trackIndex: number;
  trackName: string;
  trackType: string;
  trackUuid: string;
}[];
```

The matching tracks: the arrangement in its own order, then the video band, then the marker band.

#### clipCount

```ts
clipCount: number;
```

Number of clips (patterns) on the track.

#### region

```ts
region: string;
```

Which index space `trackIndex` counts in: 'arrangement' (the main track list), 'video', or 'marker'.

#### soundSourceName?

```ts
optional soundSourceName?: string;
```

Sound-source name for Sing and Instrument tracks; 'N-member choir'/'N-member ensemble' in choir/ensemble mode; empty for GenericMidi, which carries an external instrument instead. Omitted for the types that can have none: Audio, Video and Marker.

#### trackIndex

```ts
trackIndex: number;
```

0-based position, in the index space of `region`.

#### trackName

```ts
trackName: string;
```

Current display name.

#### trackType

```ts
trackType: string;
```

One of: Sing, Instrument, GenericMidi, Audio, Video, Marker.

#### trackUuid

```ts
trackUuid: string;
```

Track UUID in braces format. The definitive handle: it works in every region, where an index needs `region` to be read.
