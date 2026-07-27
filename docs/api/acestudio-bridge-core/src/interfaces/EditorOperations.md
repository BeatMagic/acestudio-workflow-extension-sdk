# Interface: EditorOperations

The `editor` operations, mirroring the canonical operation tree 1:1.

## Methods

### addNotes()

```ts
addNotes(params, options?): Promise<EditorAddNotesResult>;
```

Bulk-add notes to the current editor at the marker-line position.

Requires the `note.write` capability.

#### Parameters

##### params

[`EditorAddNotesParams`](EditorAddNotesParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`EditorAddNotesResult`](EditorAddNotesResult.md)\>

***

### currentClip()

```ts
currentClip(options?): Promise<EditorCurrentClipResult>;
```

Read which clip is currently open in the piano-roll editor.

Requires the `editor.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`EditorCurrentClipResult`](EditorCurrentClipResult.md)\>

***

### deleteSelection()

```ts
deleteSelection(options?): Promise<EditorDeleteSelectionResult>;
```

Delete the current selection in the editor.

Requires the `note.write` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`EditorDeleteSelectionResult`](EditorDeleteSelectionResult.md)\>

***

### getContent()

```ts
getContent(params, options?): Promise<EditorGetContentResult>;
```

Fetch the editor's notes or chords with a range selector.

Requires the `clip.read` capability.

#### Parameters

##### params

[`EditorGetContentParams`](EditorGetContentParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`EditorGetContentResult`](EditorGetContentResult.md)\>

***

### open()

```ts
open(options?): Promise<EditorOpenResult>;
```

Open (make visible) the piano-roll editor window.

Requires the `editor.write` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`EditorOpenResult`](EditorOpenResult.md)\>

***

### status()

```ts
status(options?): Promise<EditorStatusResult>;
```

Read editor open/closed state, visibility, and active clip id.

Requires the `editor.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`EditorStatusResult`](EditorStatusResult.md)\>

***

### tickRange()

```ts
tickRange(options?): Promise<EditorTickRangeResult>;
```

Read the editor's total tick range (tickBegin / tickEnd).

Requires the `editor.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`EditorTickRangeResult`](EditorTickRangeResult.md)\>
