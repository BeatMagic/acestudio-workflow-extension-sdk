# Interface: ClipMoveParams

Arguments for `clip move`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip, with or without curly braces.

***

### moveEarlier?

```ts
optional moveEarlier?: number;
```

Shift the clip earlier by this many ticks. Refused when it would start the clip before the project start.

***

### moveLater?

```ts
optional moveLater?: number;
```

Shift the clip later by this many ticks. No seconds twin: the relative moves are this surface's own addition, so there is no earlier contract to restore, and an absolute `posSec` already reaches every destination.

***

### onOccupied?

```ts
optional onOccupied?: string;
```

What to do when the destination is already occupied: `fail` (default), `cover` (trim the clips in the way; not for video), or `relocate` (stack on a new track above; video only).

***

### pos?

```ts
optional pos?: number;
```

Absolute destination for the clip's start, in ticks. Mutually exclusive with `moveLater` / `moveEarlier`.

***

### posSec?

```ts
optional posSec?: number;
```

Absolute destination for the clip's start, in seconds. OPTIONAL. When it is the only spelling given it governs — including at 0, which is a position like any other. When `pos` is given too, the clip's native unit decides between them (ADR 0032 §5), so this wins on a second-native clip and `pos` wins on a tick-native one: each keeps the value that needed no conversion. Mutually exclusive with `moveLater` / `moveEarlier`. The pair the retired `moveVideoClip` carried, restored: converting between the units needs the tempo curve, and the CLI's time-value grammar does not stand in for it — that compiles `1.5s` to ticks client-side, so a caller on the wire is left with a `convert time-to-tick` round trip.
