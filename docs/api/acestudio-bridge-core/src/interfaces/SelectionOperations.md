# Interface: SelectionOperations

The `selection` operations, mirroring the canonical operation tree 1:1.

## Methods

### get()

```ts
get(params, options?): Promise<SelectionGetResult>;
```

Read the current selection in the arrangement or editor scope.

Requires the `selection.read` capability.

#### Parameters

##### params

[`SelectionGetParams`](SelectionGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`SelectionGetResult`](SelectionGetResult.md)\>

***

### set()

```ts
set(params, options?): Promise<SelectionSetResult>;
```

Set the selection in the arrangement or editor scope.

Requires the `selection.write` capability.

#### Parameters

##### params

[`SelectionSetParams`](SelectionSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`SelectionSetResult`](SelectionSetResult.md)\>
