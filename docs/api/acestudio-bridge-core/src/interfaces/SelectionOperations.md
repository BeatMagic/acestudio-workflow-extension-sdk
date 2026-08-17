# Interface: SelectionOperations

The `selection` operations, mirroring the canonical operation tree 1:1, and the subscription that reports when the subject changes.

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

### onChanged()

```ts
onChanged(listener): Unsubscribe;
```

The arrangement selection moved: the selected tracks, the time range, or both.
`changes` carries `tracks` and `range`. A peer re-fetches with `selection get`.

Listen for `selection.changed`. The event is a hint to re-read, not the new state.

Requires the `selection.read` capability — an ungranted subscription is refused at this call, not silently never delivered.

#### Parameters

##### listener

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

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
