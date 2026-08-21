# Interface: ChoirDisableResult

Success payload of `choir disable`.

## Properties

### leaderName

```ts
leaderName: string;
```

The voice that remains: the former member 0, now the track's only AI voice.

***

### region

```ts
region: string;
```

Which index space `trackIndex` counts in: `arrangement`, the only region whose tracks this group reaches. Written out rather than implied, so a caller reading a track index anywhere on this surface reads it the same way and needs no table of which groups omit it (ADR 0129 §2).

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
