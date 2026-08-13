# Interface: EnsembleOperations

The `ensemble` operations, mirroring the canonical operation tree 1:1.

## Methods

### add()

```ts
add(params, options?): Promise<EnsembleAddResult>;
```

Add an instrument to an ensemble, by name or ref.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`EnsembleAddParams`](EnsembleAddParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`EnsembleAddResult`](EnsembleAddResult.md)\>

***

### disable()

```ts
disable(params?, options?): Promise<EnsembleDisableResult>;
```

Turn ensemble mode off, leaving the leader as the track's sole instrument.

Requires the `soundsource.write` capability.

#### Parameters

##### params?

[`EnsembleDisableParams`](EnsembleDisableParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`EnsembleDisableResult`](EnsembleDisableResult.md)\>

***

### enable()

```ts
enable(params?, options?): Promise<EnsembleEnableResult>;
```

Turn ensemble mode on for an Instrument track, keeping its current instrument as the leader.

Requires the `soundsource.write` capability.

#### Parameters

##### params?

[`EnsembleEnableParams`](EnsembleEnableParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`EnsembleEnableResult`](EnsembleEnableResult.md)\>

***

### get()

```ts
get(params?, options?): Promise<EnsembleGetResult>;
```

Read an Instrument track's ensemble: whether it is on, its settings, and every member.

Requires the `soundsource.read` capability.

#### Parameters

##### params?

[`EnsembleGetParams`](EnsembleGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`EnsembleGetResult`](EnsembleGetResult.md)\>

***

### remove()

```ts
remove(params, options?): Promise<EnsembleRemoveResult>;
```

Remove one instrument from an ensemble.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`EnsembleRemoveParams`](EnsembleRemoveParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`EnsembleRemoveResult`](EnsembleRemoveResult.md)\>

***

### reorder()

```ts
reorder(params, options?): Promise<EnsembleReorderResult>;
```

Move an ensemble member to another position, which is how you choose the leader.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`EnsembleReorderParams`](EnsembleReorderParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`EnsembleReorderResult`](EnsembleReorderResult.md)\>

***

### set()

```ts
set(params?, options?): Promise<void>;
```

Set the ensemble's timing and width, or one member's gain and mute.

Requires the `soundsource.write` capability.

#### Parameters

##### params?

[`EnsembleSetParams`](EnsembleSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
