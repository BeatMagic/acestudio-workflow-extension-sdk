# Interface: TrackCreateParams

Arguments for `track create`.

## Properties

### index?

```ts
optional index?: number;
```

0-based position to insert at, in the index space the new track's region uses. Omit to append after the last content track.

***

### name?

```ts
optional name?: string;
```

Optional display name. Omit to take the type's default name.

***

### source?

```ts
optional source?: string;
```

Create the track with this sound source already on it, by display name or ref — the same thing `sound-source load`'s `source` accepts. The track type follows from the source, so `type` is not needed alongside it.

***

### type?

```ts
optional type?: string;
```

Track type to create: `sing`, `instrument`, `genericMidi`, `audio`, `video`, or `marker` — the same spellings `trackType` is reported in, matched case-insensitively. Optional when `source` is given, which implies the type.
