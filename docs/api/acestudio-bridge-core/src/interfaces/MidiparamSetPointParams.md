# Interface: MidiparamSetPointParams

Arguments for `midiparam set-point`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form). Must be a GenericMidi clip.

***

### lane

```ts
lane: string;
```

The lane to write: `cc\<N\>` (0-127) or `pitchbend`. `velocity` is per-note — write it with `midiparam set-velocity`.

***

### pos

```ts
pos: number;
```

Where the anchor goes, in clip-local ticks. Must be \>= 0. An anchor already at this position is replaced.

***

### value

```ts
value: number;
```

Raw MIDI value: 0-127 for a CC lane, 0-16383 for `pitchbend`.
