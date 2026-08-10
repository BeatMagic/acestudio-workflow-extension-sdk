# Interface: ChoirReorderResult

Success payload of `choir reorder`.

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
