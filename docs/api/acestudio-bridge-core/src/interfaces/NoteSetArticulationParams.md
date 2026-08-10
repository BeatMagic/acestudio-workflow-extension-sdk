# Interface: NoteSetArticulationParams

Arguments for `note set-articulation`.

## Properties

### articulation

```ts
articulation: string;
```

The articulation to apply. Which names are valid depends on the instrument loaded on the track; read the current value back from `clip note-content`.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the target notes. All must be in the same Instrument clip.
