# Interface: TrackResolveResult

Success payload of `track resolve`.

## Properties

### tracks

```ts
tracks: {
  found: boolean;
  region?: string;
  trackIndex?: number;
  trackName?: string;
  trackType?: string;
  trackUuid?: string;
}[];
```

One entry per addressed track, positionally parallel to the input: every `trackUuids` entry in the order given, then every `trackIndices` entry in the order given. A caller reads its answers off by position rather than joining on an identity.

#### found

```ts
found: boolean;
```

Whether the addressed track exists. False leaves everything but the echoed identity absent. A miss is reported here rather than failing the call: bulk translation of a possibly stale uuid set is the main reason to call this verb, and failing all of it because one track was deleted would push the caller back to one request per track (ADR 0129 §5). A miss means the target is not there — a deleted track, or an index past the end of its region. A target that was never addressable at all is a different thing and refuses the whole call: a string that is not a uuid, a negative index, an unparsable `region`. Nothing about those is stale, and reporting one as a miss would tell a caller its track had been deleted when it had a typo.

#### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, `video`, `marker`, or `chord`. Absent for the master, and travels with `trackIndex` everywhere else.

#### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Absent for the master, which has no position, and for a miss addressed by uuid.

#### trackName?

```ts
optional trackName?: string;
```

Current display name — enough to render a human-readable label without a second call. Absent on a miss, and for the master bus, which carries no name of its own.

#### trackType?

```ts
optional trackType?: string;
```

One of: Sing, Instrument, GenericMidi, Audio, Video, Marker, Chord, Empty, or Master. Absent on a miss.

#### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, or `master`. Absent for an empty arrangement slot, which has none, and for a miss addressed by index.
