# Interface: TrackCreateParams

Arguments for `track create`.

## Properties

### index?

```ts
optional index?: number | null;
```

0-based position to insert at. Omit to append after the last content track.

Counts in the index space the new track's region uses: the arrangement for `sing`/`instrument`/`genericMidi`/`audio`, and the pinned Video or Marker band for `video`/`marker` (ADR 0104), whose indices are local to that band.

***

### name?

```ts
optional name?: string | null;
```

Optional display name. Omit to take the type's default name.

***

### source?

```ts
optional source?: string | null;
```

Create the track with this sound source already on it, by display name or ref — the same thing `sound-source load --source` accepts.

The track type follows from the source, so `--type` is not needed alongside it. This is the only path that reports the track's resolved note language, because it is the only point at which a Sing track's language is decided.

***

### type?

```ts
optional type?: string | null;
```

Track type to create: `sing`, `instrument`, `genericMidi`, `audio`, `video`, or `marker` — the same spellings `trackType` is reported in, matched case-insensitively.

`chord` is not creatable: a project has exactly one chord track, always. Neither is `empty` — an empty slot is what the arrangement pads itself with, not something you ask for.

Optional when `--source` is given, which implies the type.
