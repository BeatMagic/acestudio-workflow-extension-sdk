# Interface: NoteMoveParams

Arguments for `note move`.

## Properties

### moveEarlier?

```ts
optional moveEarlier?: number | null;
```

Shift every note this much earlier. Same length forms as `--later`. The move is rejected if it would push any note before tick 0.

***

### moveLater?

```ts
optional moveLater?: number | null;
```

Shift every note this much later. A length: ticks (`480t`), a note value (`1/4`), beats (`2b`), or measures (`1bar`). The grammar has no sign, so "earlier" is its own flag.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the notes to move, from `clip note-content`. Repeat the flag or pass several values after one flag.

***

### pitch?

```ts
optional pitch?: number | null;
```

New MIDI pitch (0-127) of the anchor note; the rest transpose by the same interval.

***

### pitchDelta?

```ts
optional pitchDelta?: number | null;
```

Transpose every note by this many semitones. Negative moves down.

***

### pos?

```ts
optional pos?: number | null;
```

New position of the anchor note. Ticks (`960t`), clock time (`1.5s`), or a musical position (`4.1.0`). Ticks are clip-local unless `--to-scope project` says otherwise; musical and clock forms are always project-framed. See `help time-values`.

***

### posScope?

```ts
optional posScope?: string | null;
```

Coordinate system `--to` is expressed in. Defaults to `clip-local` — a note only exists inside a clip, and it is the frame `clip note-content` reports note positions in, so a value read from there goes straight back. Pass `project` for the global timeline; musical and clock forms imply it, since they have no clip-local meaning.
