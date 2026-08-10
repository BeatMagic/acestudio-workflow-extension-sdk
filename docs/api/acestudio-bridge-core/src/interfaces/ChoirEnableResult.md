# Interface: ChoirEnableResult

Success payload of `choir enable`.

## Properties

### memberCount

```ts
memberCount: number;
```

How many members the choir now holds. Enabling keeps the existing AI voice as the leader, so this is 1 unless the track already had a choir.

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

The track's name after enabling. Turning choir mode on renames the track, which is why the new name is reported.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.
