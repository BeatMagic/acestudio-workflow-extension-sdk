# Interface: ChoirAddResult

Success payload of `choir add`.

## Properties

### leaderName?

```ts
optional leaderName?: string;
```

Display name of the current leader. A reorder can change this, which is the point of reordering.

***

### memberCount

```ts
memberCount: number;
```

How many members the choir holds now.

***

### memberIndex?

```ts
optional memberIndex?: number;
```

Where the affected member ended up, or was removed from.

***

### memberName?

```ts
optional memberName?: string;
```

Display name of the affected member's voice.

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

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.
