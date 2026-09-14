# Interface: MidiparamWriteParams

Arguments for `midiparam write`.

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

### points

```ts
points: {
  pos: number;
  value: number;
}[];
```

The anchors to write, sorted by `pos` ascending with no duplicates. Without `replace`, at least two anchors spanning a positive range: they define the span that is replaced, and the envelope outside it is untouched. With `replace: lane`, one or more anchors that become the whole lane.

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

***

### replace?

```ts
optional replace?: "lane";
```

The one value `midiparam write`'s `replace` argument takes. Declared as a roster so the schema says what the flag means: the write replaces the whole lane rather than the span its anchors cover.
