# Interface: TempoPointsResult

Success payload of `tempo points`.

## Properties

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the whole tempo point list. Carry it back as the reserved `fingerprint` argument on `tempo set-point`, `tempo remove-point` or `tempo set` to fail STALE_WRITE instead of overwriting edits made since this read.

***

### nativeUnit

```ts
nativeUnit: "tick";
```

The unit a `tempo points` position is authoritative in. Always `tick`: a tempo point is addressed by the tick it sits on, and the `posSec` reported beside it is derived from the very curve these points define.

***

### pointCount

```ts
pointCount: number;
```

Number of entries in `points` (convenience field).

***

### points

```ts
points: {
  bend: number;
  pos: number;
  posSec: number;
  value: number;
}[];
```

All tempo points, in ascending pos order.

#### bend

```ts
bend: number;
```

Curve control toward the next point; 0.0 = linear.

#### pos

```ts
pos: number;
```

Point position, in project ticks. The native unit — what `set-point` and `remove-point` address.

#### posSec

```ts
posSec: number;
```

The same position in seconds, under the current tempo curve. Derived, so editing one point moves the seconds of every point after it.

#### value

```ts
value: number;
```

Tempo at this point, in BPM.
