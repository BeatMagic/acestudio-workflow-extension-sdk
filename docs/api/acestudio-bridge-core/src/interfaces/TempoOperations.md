# Interface: TempoOperations

The `tempo` operations, mirroring the canonical operation tree 1:1.

## Methods

### get()

```ts
get(options?): Promise<TempoGetResult>;
```

Read the full tempo automation table (all BPM points).

Requires the `tempo.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TempoGetResult`](TempoGetResult.md)\>

***

### set()

```ts
set(params, options?): Promise<void>;
```

Replace the entire tempo automation table with a new list of points.

Requires the `tempo.write` capability.

#### Parameters

##### params

[`TempoSetParams`](TempoSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
