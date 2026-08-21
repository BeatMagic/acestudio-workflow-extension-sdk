# Interface: TrackRenameParams

Arguments for `track rename`.

## Properties

### newName

```ts
newName: string;
```

New display name. Pass an empty string to restore the track's default fallback name (sound-source name for Sing/Instrument, audio filename for Audio, generic label for GenericMidi).

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video` or `marker`. A protected marker track is refused whichever form named it, and the chord track has no name to set.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format. Mutually exclusive with `trackIndex`.
