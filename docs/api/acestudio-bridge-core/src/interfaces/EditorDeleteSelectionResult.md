# Interface: EditorDeleteSelectionResult

Success payload of `editor delete-selection`.

## Properties

### deletedCount

```ts
deletedCount: number;
```

Number of notes or chords deleted. May be 0 for a parameters-only deletion.

***

### editorType

```ts
editorType: string;
```

Clip type of the active editor: Sing, Instrument, GenericMidi, or Chord.

***

### success

```ts
success: boolean;
```

True when something was deleted (or a parameters-only deletion ran); false only when the chord editor had no selection.
