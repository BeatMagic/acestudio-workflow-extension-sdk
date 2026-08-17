# Interface: NoteMoveParams

Arguments for `note move`.

## Properties

### moveEarlier?

```ts
optional moveEarlier?: number;
```

Shift every note this much earlier, in ticks. The move is refused if it would push any note before tick 0.

***

### moveLater?

```ts
optional moveLater?: number;
```

Shift every note this much later, in ticks. Mutually exclusive with `moveEarlier`.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the notes to move, from `clip note-content`.

***

### pitch?

```ts
optional pitch?: number;
```

New MIDI pitch (0-127) of the anchor note; the rest transpose by the same interval. Mutually exclusive with `pitchDelta`.

***

### pitchDelta?

```ts
optional pitchDelta?: number;
```

Transpose every note by this many semitones. Negative moves down.

***

### pos?

```ts
optional pos?: number;
```

New position of the anchor note, in ticks. Mutually exclusive with `moveLater` / `moveEarlier`.

***

### posScope?

```ts
optional posScope?: string;
```

Coordinate system `pos` is expressed in: `"clip-local"` (default) or `"project"`. Ignored unless `pos` is given.
