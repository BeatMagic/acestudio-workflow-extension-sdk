# Interface: TrackReorderResult

Success payload of `track reorder`.

## Properties

### language?

```ts
optional language?: string;
```

Full English name of the track's default note language. Present only when `track create`'s `source` built a Sing track — the one moment a track's language is decided.

***

### region

```ts
region: string;
```

Which index space `trackIndex` counts in: 'arrangement' (the main track list), 'video', or 'marker'.

***

### soundSourceName?

```ts
optional soundSourceName?: string;
```

The sound source the track was created with. Present only when `track create`'s `source` put one there.

***

### trackIndex

```ts
trackIndex: number;
```

0-based resting position, in the index space of `region`.

***

### trackName

```ts
trackName: string;
```

Display name the track came to rest with.

***

### trackType

```ts
trackType: string;
```

One of: Sing, Instrument, GenericMidi, Audio, Video, Marker.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of the placed track, in braces format. For `duplicate` this is the copy's fresh UUID, not the original's.
