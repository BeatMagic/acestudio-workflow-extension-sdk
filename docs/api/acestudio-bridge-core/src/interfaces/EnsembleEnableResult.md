# Interface: EnsembleEnableResult

Success payload of `ensemble enable`.

## Properties

### memberCount

```ts
memberCount: number;
```

How many members the ensemble now holds. Enabling keeps the existing instrument as the leader, so this is 1 unless the track already had an ensemble.

***

### region

```ts
region: string;
```

Which index space `trackIndex` counts in: `arrangement`, the only region whose tracks this group reaches. Written out rather than implied, so a caller reading a track index anywhere on this surface reads it the same way and needs no table of which groups omit it (ADR 0129 §2).

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track.

***

### trackName?

```ts
optional trackName?: string;
```

The track's name after enabling. Turning ensemble mode on renames the track, which is why the new name is reported.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.
