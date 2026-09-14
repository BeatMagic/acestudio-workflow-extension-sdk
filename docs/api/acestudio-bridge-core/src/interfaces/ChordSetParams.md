# Interface: ChordSetParams

Arguments for `chord set`.

## Properties

### addeds?

```ts
optional addeds?: string[];
```

Added tones, e.g. `["9", "sus4"]`. Replaces the whole set rather than adding to it — it is a set, not a list to append to — so the empty array clears it. Refused when a name is not an added tone the chord's type supports.

***

### bass?

```ts
optional bass?: number;
```

Bass pitch class, 0-11, or `-1` to clear it.

***

### chordUuids

```ts
chordUuids: string[];
```

UUIDs of the chords to modify, with or without braces. Every field given is applied to every chord named, which is what makes "set all of these to min7" one call and one undo entry.

***

### dur?

```ts
optional dur?: number;
```

Duration in ticks. Positive: a zero-length chord occupies no span, and every chord after it would report the same position.

***

### root?

```ts
optional root?: number;
```

Root pitch class, 0-11 for C through B, or `-1` to clear it.

***

### type?

```ts
optional type?: string;
```

Chord type, e.g. `maj`, `min`, or the empty string to clear it. Refused when the app knows no such type.
