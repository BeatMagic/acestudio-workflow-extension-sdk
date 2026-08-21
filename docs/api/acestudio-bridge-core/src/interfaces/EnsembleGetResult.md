# Interface: EnsembleGetResult

Success payload of `ensemble get`.

## Properties

### enabled

```ts
enabled: boolean;
```

Whether ensemble mode is on. When false there is exactly one instrument and `members` reports it as the leader.

***

### maxMembers?

```ts
optional maxMembers?: number;
```

The ceiling `ensemble add` enforces.

***

### memberCount

```ts
memberCount: number;
```

How many members the ensemble holds.

***

### members

```ts
members: {
  category?: string;
  gain: number;
  index: number;
  isLeader: boolean;
  mute: boolean;
  name: string;
  ref?: string;
}[];
```

The members in order. Index 0 is the leader.

#### category?

```ts
optional category?: string;
```

Instrument category, e.g. 'Piano'.

#### gain

```ts
gain: number;
```

Member gain in dB.

#### index

```ts
index: number;
```

0-based position in the ensemble. Member 0 is the leader.

#### isLeader

```ts
isLeader: boolean;
```

True for member 0. The leader is what the track falls back to when ensemble mode is turned off.

#### mute

```ts
mute: boolean;
```

Whether this member is muted.

#### name

```ts
name: string;
```

Display name of this member's instrument.

#### ref?

```ts
optional ref?: string;
```

Ref of that instrument, in the same form `sound-source load --source` accepts.

***

### offset?

```ts
optional offset?: number;
```

Timing offset between members, in milliseconds. The UI calls this Offset.

***

### region

```ts
region: string;
```

Which index space `trackIndex` counts in: `arrangement`, the only region whose tracks this group reaches. Written out rather than implied, so a caller reading a track index anywhere on this surface reads it the same way and needs no table of which groups omit it (ADR 0129 §2).

***

### spread?

```ts
optional spread?: number;
```

Stereo spread across the members, 0 to 1. The UI calls this Spread.

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
