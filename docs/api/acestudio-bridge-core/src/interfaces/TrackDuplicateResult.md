# Interface: TrackDuplicateResult

Success payload of `track duplicate`.

## Properties

### language?

```ts
optional language?: string;
```

Full English name of the track's default note language. Present only when `track create --source` built a Sing track, which is the one moment a track's language is decided; changing it afterwards is `track set-language`.

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

The sound source the track was created with. Present only when `track create --source` put one there.

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
