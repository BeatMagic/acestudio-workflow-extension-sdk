# Interface: MidiparamSetVelocityParams

Arguments for `midiparam set-velocity`.

## Properties

### noteUuids

```ts
noteUuids: string[];
```

The notes to set, by id (braced form). All must belong to one GenericMidi clip.

***

### velocity

```ts
velocity: number;
```

The velocity every named note gets, 1-127.
