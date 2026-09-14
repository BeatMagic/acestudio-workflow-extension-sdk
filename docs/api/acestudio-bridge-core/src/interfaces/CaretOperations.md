# Interface: CaretOperations

The `caret` operations, mirroring the canonical operation tree 1:1.

## Methods

### get()

```ts
get(params?, options?): Promise<CaretGetResult>;
```

Read the caret position (track index, tick and seconds, scope) and which view holds focus.

Requires the `caret.read` capability.

#### Parameters

##### params?

[`CaretGetParams`](CaretGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`CaretGetResult`](CaretGetResult.md)\>

***

### set()

```ts
set(params?, options?): Promise<void>;
```

Move the caret to a position given in ticks or in seconds.

Requires the `caret.write` capability.

#### Parameters

##### params?

[`CaretSetParams`](CaretSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
