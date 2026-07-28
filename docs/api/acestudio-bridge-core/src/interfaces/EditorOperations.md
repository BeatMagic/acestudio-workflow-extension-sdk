# Interface: EditorOperations

The `editor` operations, mirroring the canonical operation tree 1:1.

## Methods

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
