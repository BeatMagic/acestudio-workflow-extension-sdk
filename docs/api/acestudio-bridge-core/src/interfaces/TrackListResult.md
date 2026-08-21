# Interface: TrackListResult

Success payload of `track list`.

## Properties

### contentTrackCount

```ts
contentTrackCount: number;
```

How many of the reported tracks are content tracks — everything except the empty arrangement slots `includeEmpty` adds. It coincides with the length of `tracks` until `includeEmpty` puts empty slots in the array. A caller that wants the array's length reads the array.

***

### tracks

```ts
tracks: {
  clipCount?: number;
  isProtected?: boolean;
  protectedRole?: string;
  region: string;
  soundSourceName?: string;
  trackIndex: number;
  trackName?: string;
  trackType: string;
  trackUuid?: string;
}[];
```

The matching tracks: the arrangement in its own order, then the video band, then the marker band, then the chord track.

#### clipCount?

```ts
optional clipCount?: number;
```

Number of clips (patterns) on the track. Omitted for an empty slot, which is a position rather than a track and so holds none.

#### isProtected?

```ts
optional isProtected?: boolean;
```

Whether this marker track is system-owned and so protected from user delete and rename. **Marker tracks only** — omitted for every other type, which cannot be protected at all, rather than reported false.

#### protectedRole?

```ts
optional protectedRole?: string;
```

Which system role a protected marker track fills: `sections` or `lyrics`. Stable and locale-independent, unlike `trackName`, which is the localized display string derived from it. Reported because it is the idempotency key `track ensure-system` is addressed by: without it, the only way to learn which marker track holds which role is to call `track ensure-system` again and read back the id, turning an observation into a write-shaped probe. **Protected marker tracks only** — omitted for an ordinary one, which fills no role.

#### region

```ts
region: string;
```

Which index space `trackIndex` counts in: 'arrangement' (the main track list), 'video', 'marker', or 'chord'. 'chord' holds the one chord track at index 0. It is reported as its own region rather than as an arrangement position because the arrangement does not contain it, and an index read against the wrong space names an unrelated track.

#### soundSourceName?

```ts
optional soundSourceName?: string;
```

Sound-source name for Sing and Instrument tracks; 'N-member choir'/'N-member ensemble' in choir/ensemble mode; empty for GenericMidi, which carries an external instrument instead. Omitted for the types that can have none: Audio, Video, Marker and Chord.

#### trackIndex

```ts
trackIndex: number;
```

0-based position, in the index space of `region`.

#### trackName?

```ts
optional trackName?: string;
```

Current display name. Omitted for an empty slot, which nobody named.

#### trackType

```ts
trackType: string;
```

One of: Sing, Instrument, GenericMidi, Audio, Video, Marker, Chord, or Empty for a slot `includeEmpty` added. An `Empty` row carries this, `trackIndex` and `region` and nothing else: a slot is a position that holds no track, so every other field here is a property of a track it does not have. It is the same shape `track get` answers with for that slot, so the two verbs never describe one position two ways.

#### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format. The definitive handle: it works in every region, where an index needs `region` to be read. Omitted for an empty arrangement slot, which `includeEmpty` adds and which has no handle to hand out. Absence is the honest answer there — the alternative is a value that names padding the arrangement replaces the moment someone creates a track.
