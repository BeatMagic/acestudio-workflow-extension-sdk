# Interface: ChoirOperations

The `choir` operations, mirroring the canonical operation tree 1:1.

## Methods

### add()

```ts
add(params, options?): Promise<ChoirAddResult>;
```

Add an AI voice to a choir, by name or ref.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`ChoirAddParams`](ChoirAddParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ChoirAddResult`](ChoirAddResult.md)\>

***

### disable()

```ts
disable(params?, options?): Promise<ChoirDisableResult>;
```

Turn choir mode off, leaving the leader as the track's only AI voice.

Requires the `soundsource.write` capability.

#### Parameters

##### params?

[`ChoirDisableParams`](ChoirDisableParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ChoirDisableResult`](ChoirDisableResult.md)\>

***

### enable()

```ts
enable(params?, options?): Promise<ChoirEnableResult>;
```

Turn choir mode on for a Sing track, keeping its current AI voice as the leader.

Requires the `soundsource.write` capability.

#### Parameters

##### params?

[`ChoirEnableParams`](ChoirEnableParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ChoirEnableResult`](ChoirEnableResult.md)\>

***

### get()

```ts
get(params?, options?): Promise<ChoirGetResult>;
```

Read a Sing track's choir: whether it is on, its settings, and every member.

Requires the `soundsource.read` capability.

#### Parameters

##### params?

[`ChoirGetParams`](ChoirGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ChoirGetResult`](ChoirGetResult.md)\>

***

### remove()

```ts
remove(params, options?): Promise<ChoirRemoveResult>;
```

Remove one AI voice from a choir.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`ChoirRemoveParams`](ChoirRemoveParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ChoirRemoveResult`](ChoirRemoveResult.md)\>

***

### reorder()

```ts
reorder(params, options?): Promise<ChoirReorderResult>;
```

Move a choir member to another position, which is how you choose the leader.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`ChoirReorderParams`](ChoirReorderParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ChoirReorderResult`](ChoirReorderResult.md)\>

***

### set()

```ts
set(params?, options?): Promise<void>;
```

Set the choir's timing and width, or one member's gain and mute.

Requires the `soundsource.write` capability.

#### Parameters

##### params?

[`ChoirSetParams`](ChoirSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
