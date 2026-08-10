# Interface: ChoirGetResult

Success payload of `choir get`.

## Properties

### enabled

```ts
enabled: boolean;
```

Whether choir mode is on. When false there is exactly one AI voice and `members` reports it as the leader.

***

### maxMembers?

```ts
optional maxMembers?: number;
```

The ceiling `choir add` enforces.

***

### memberCount

```ts
memberCount: number;
```

How many members the choir holds.

***

### members

```ts
members: {
  gain: number;
  index: number;
  isLeader: boolean;
  isVoiceBlend?: boolean;
  modelName?: string;
  mute: boolean;
  name: string;
  ref?: string;
}[];
```

The members in order. Index 0 is the leader.

#### gain

```ts
gain: number;
```

Member gain in dB.

#### index

```ts
index: number;
```

0-based position in the choir. Member 0 is the leader.

#### isLeader

```ts
isLeader: boolean;
```

True for member 0. The leader is what the track falls back to when choir mode is turned off.

#### isVoiceBlend?

```ts
optional isVoiceBlend?: boolean;
```

True when this member's voice is a blend rather than an ordinary voice. A choir member may be either.

#### modelName?

```ts
optional modelName?: string;
```

The vocal synth model this member sings through.

#### mute

```ts
mute: boolean;
```

Whether this member is muted.

#### name

```ts
name: string;
```

Display name of this member's voice.

#### ref?

```ts
optional ref?: string;
```

Ref of that voice, in the same form `sound-source load --source` accepts.

***

### offset?

```ts
optional offset?: number;
```

Timing offset between members, in milliseconds. The UI calls this Offset.

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
