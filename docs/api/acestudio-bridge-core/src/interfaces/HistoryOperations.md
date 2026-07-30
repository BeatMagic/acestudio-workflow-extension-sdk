# Interface: HistoryOperations

The `history` operations, mirroring the canonical operation tree 1:1.

## Methods

### list()

```ts
list(params, options?): Promise<HistoryListResult>;
```

List undo-stack entries newest first, with their names and authors.

Requires the `history.read` capability.

#### Parameters

##### params

[`HistoryListParams`](HistoryListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`HistoryListResult`](HistoryListResult.md)\>

***

### redo()

```ts
redo(options?): Promise<HistoryRedoResult>;
```

Redo the entry the last undo took back, whoever authored it.

Requires the `history.control` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`HistoryRedoResult`](HistoryRedoResult.md)\>

***

### undo()

```ts
undo(options?): Promise<HistoryUndoResult>;
```

Undo the top entry of the shared undo stack, whoever authored it.

Requires the `history.control` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`HistoryUndoResult`](HistoryUndoResult.md)\>
