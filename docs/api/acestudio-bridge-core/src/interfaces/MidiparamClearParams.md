# Interface: MidiparamClearParams

Arguments for `midiparam clear`.

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

The lane to clear: `cc\<N\>` (0-127) or `pitchbend`.
