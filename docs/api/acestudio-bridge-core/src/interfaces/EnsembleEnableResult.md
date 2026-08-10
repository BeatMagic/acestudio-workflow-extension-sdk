# Interface: EnsembleEnableResult

Success payload of `ensemble enable`.

## Properties

### memberCount

```ts
memberCount: number;
```

How many members the ensemble now holds. Enabling keeps the existing instrument as the leader, so this is 1 unless the track already had an ensemble.

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
