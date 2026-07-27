# Interface: TrackRenameParams

Arguments for `track rename`.

## Properties

### newName

```ts
newName: string;
```

New display name. Pass an empty string to restore the track's default fallback name (sound-source name for Sing/Instrument, audio filename for Audio, generic label for GenericMidi).

***

### trackIndex

```ts
trackIndex: number;
```

0-based track index.
