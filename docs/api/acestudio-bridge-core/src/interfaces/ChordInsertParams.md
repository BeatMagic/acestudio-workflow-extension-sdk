# Interface: ChordInsertParams

Arguments for `chord insert`.

## Properties

### addeds?

```ts
optional addeds?: string[];
```

Added tones, e.g. `["9", "sus4"]`. Refused when a name is not an added tone the chord's type supports.

***

### bass?

```ts
optional bass?: number;
```

Bass pitch class, 0-11.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the chord clip to insert into, with or without braces.

***

### dur

```ts
dur: number;
```

Duration in ticks. Required — a new chord has no duration to leave alone. Positive: a zero-length chord occupies no span, and every chord after it would report the same position.

***

### index

```ts
index: number;
```

0-based position in the chord list to insert at. `0` puts the chord before the first, and the current chord count appends. Out of range is refused rather than clamped: a clamped insert silently puts the chord somewhere the caller did not ask for.

***

### root?

```ts
optional root?: number;
```

Root pitch class, 0-11 for C through B. Omitted leaves the chord with no root, which is a legitimate placeholder.

***

### type?

```ts
optional type?: string;
```

Chord type, e.g. `maj`, `min`. Refused when the app knows no such type.
