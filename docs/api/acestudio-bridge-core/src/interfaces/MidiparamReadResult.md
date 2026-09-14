# Interface: MidiparamReadResult

Success payload of `midiparam read`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The clip read from.

***

### controller

```ts
controller: number;
```

MIDI controller number, 0-127; 128 for pitch bend.

***

### defaultValue

```ts
defaultValue: number;
```

What the instrument receives where the lane draws nothing, per MIDI 1.0 / General MIDI: pitch bend centre 8192, Volume 100, Balance and Pan 64, Expression 127, everything else 0.

***

### empty

```ts
empty: boolean;
```

True when the whole lane holds no anchors — the controller is not touched at all and the instrument sees `defaultValue`. Reports the lane's state, not the requested range's.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of this lane's whole anchor list (ADR 0088 §5). Carry it back as the reserved `fingerprint` argument on the lane's writes to fail STALE_WRITE instead of overwriting edits made since this read.

***

### lane

```ts
lane: string;
```

The lane read.

***

### maxValue

```ts
maxValue: number;
```

The lane's maximum raw value: 127 for a CC, 16383 for `pitchbend`. The minimum is always 0.

***

### name?

```ts
optional name?: string;
```

The controller's standard MIDI name, untranslated. Absent for a controller the specification leaves undefined; `Pitch Bend` for the `pitchbend` lane.

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
  pos: number;
  value: number;
}[];
```

The anchors in the requested range, in ascending pos order.

#### pos

```ts
pos: number;
```

Anchor position, in clip-local ticks. Must be \>= 0.

#### value

```ts
value: number;
```

Raw MIDI value at this anchor: 0-127 for a CC lane, 0-16383 for `pitchbend`.
