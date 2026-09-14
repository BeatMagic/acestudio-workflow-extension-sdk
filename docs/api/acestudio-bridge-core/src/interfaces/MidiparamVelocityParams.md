# Interface: MidiparamVelocityParams

Arguments for `midiparam velocity`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form). Must be a GenericMidi clip.

***

### noteUuids?

```ts
optional noteUuids?: string[];
```

Report only these notes (ids in braced form) instead of the whole clip. A note not in the clip is a NOT_FOUND.
