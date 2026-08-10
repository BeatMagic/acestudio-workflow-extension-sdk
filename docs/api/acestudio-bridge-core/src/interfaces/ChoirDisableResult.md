# Interface: ChoirDisableResult

Success payload of `choir disable`.

## Properties

### leaderName

```ts
leaderName: string;
```

The voice that remains: the former member 0, now the track's only AI voice.

***

### removedCount

```ts
removedCount: number;
```

How many non-leader members were dropped. This is why disabling is not the inverse of enabling.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.
