# Interface: MidiparamReadParams

Arguments for `midiparam read`.

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

The lane to read: `cc\<N\>` (0-127) or `pitchbend`. `velocity` is per-note — read it with `midiparam velocity`.

***

### posBegin?

```ts
optional posBegin?: number;
```

First clip-local tick to report anchors from (inclusive). Omit to read from the lane's first anchor.

***

### posEnd?

```ts
optional posEnd?: number;
```

Last clip-local tick to report anchors to (inclusive). Omit to read to the lane's last anchor.
