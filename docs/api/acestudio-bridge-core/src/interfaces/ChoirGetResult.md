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
  saveState?: "unmixed" | "unsaved" | "saved" | "changed";
  seedCount?: number;
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

True when this member's voice has been adjusted away from the stock voice it started as — the same test `track get` reports for a singer track. A choir member may be either. Not "has more than one seed": a single seed at a fractional weight is an average against the base model, which is a blend the seed count cannot detect. Read `seedCount` for the recipe's size.

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

#### saveState?

```ts
optional saveState?: "unmixed" | "unsaved" | "saved" | "changed";
```

How far a track's voice mix has travelled from the stock voice it was mounted as. This is what Studio captions a Sing track with — the singer's own name, the literal "Unsaved VoiceMix", or a saved blend's name — and what tells a caller whether there is a recipe worth saving. Declared here rather than in one group because `sound-source get`, `choir get` and `track get` all describe the same track's mix. Three groups spelling one roster themselves is three rosters that can drift. There is no value for "the project could not say". A mix whose state is unreadable reports the field absent, the way a track with no position omits its index rather than sending a sentinel a caller would read as a position (ADR 0129 §6).

#### seedCount?

```ts
optional seedCount?: number;
```

How many seed voices the member's recipe names. Every voice is a recipe of seeds and an ordinary one is a recipe of exactly one, so a stock voice reports `1` — which is why `1` is an ordinary case rather than a contradiction of `isVoiceBlend`, and why a count cannot stand in for it. See there.

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
