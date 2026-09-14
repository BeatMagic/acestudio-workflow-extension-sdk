# Interface: MidiparamRemovePointParams

Arguments for `midiparam remove-point`.

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

The lane to edit: `cc\<N\>` (0-127) or `pitchbend`.

***

### pos

```ts
pos: number;
```

The anchor to remove, in clip-local ticks. No anchor there is a NOT_FOUND.
