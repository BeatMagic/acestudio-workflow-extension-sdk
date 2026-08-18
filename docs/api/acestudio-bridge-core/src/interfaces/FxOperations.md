# Interface: FxOperations

The `fx` operations, mirroring the canonical operation tree 1:1.

## Methods

### add()

```ts
add(params, options?): Promise<FxAddResult>;
```

Insert an effect into a chain, by default at the end.

Requires the `fx.write` capability.

#### Parameters

##### params

[`FxAddParams`](FxAddParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxAddResult`](FxAddResult.md)\>

***

### applyPreset()

```ts
applyPreset(params?, options?): Promise<FxApplyPresetResult>;
```

Apply a library preset to an insert, replacing its current parameter state.

Requires the `fx.write` capability.

#### Parameters

##### params?

[`FxApplyPresetParams`](FxApplyPresetParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`FxApplyPresetResult`](FxApplyPresetResult.md)\>

***

### getParams()

```ts
getParams(params?, options?): Promise<FxGetParamsResult>;
```

List one insert's parameters — id, range, current value and display text — with the token the reserved `fingerprint` argument carries back.

Requires the `fx.read` capability.

#### Parameters

##### params?

[`FxGetParamsParams`](FxGetParamsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`FxGetParamsResult`](FxGetParamsResult.md)\>

***

### list()

```ts
list(params?, options?): Promise<FxListResult>;
```

List the inserts on one chain, in order, with the instance ids the other verbs address them by.

Requires the `fx.read` capability.

#### Parameters

##### params?

[`FxListParams`](FxListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`FxListResult`](FxListResult.md)\>

***

### listAvailable()

```ts
listAvailable(params?, options?): Promise<FxListAvailableResult>;
```

List every effect that can be inserted: ACE's built-in set plus the third-party plugins the last scan found.

Requires the `fx.read` capability.

#### Parameters

##### params?

[`FxListAvailableParams`](FxListAvailableParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`FxListAvailableResult`](FxListAvailableResult.md)\>

***

### listParams()

```ts
listParams(params?, options?): Promise<FxListParamsResult>;
```

List the names of one insert's parameters, so a caller can see what is there before reading any of it. `detail` adds each one's shape; values come from `fx get-params`.

Requires the `fx.read` capability.

#### Parameters

##### params?

[`FxListParamsParams`](FxListParamsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`FxListParamsResult`](FxListParamsResult.md)\>

***

### openEditor()

```ts
openEditor(params?, options?): Promise<FxOpenEditorResult>;
```

Open a third-party plugin's own editor window for one insert.

Requires the `ui.control` capability.

#### Parameters

##### params?

[`FxOpenEditorParams`](FxOpenEditorParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxOpenEditorResult`](FxOpenEditorResult.md)\>

***

### remove()

```ts
remove(params?, options?): Promise<FxRemoveResult>;
```

Take one insert out of a chain.

Requires the `fx.write` capability.

#### Parameters

##### params?

[`FxRemoveParams`](FxRemoveParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxRemoveResult`](FxRemoveResult.md)\>

***

### reorder()

```ts
reorder(params, options?): Promise<FxReorderResult>;
```

Move one insert to another slot in the same chain. The plugin keeps its instance id and its DSP state.

Requires the `fx.write` capability.

#### Parameters

##### params

[`FxReorderParams`](FxReorderParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxReorderResult`](FxReorderResult.md)\>

***

### savePreset()

```ts
savePreset(params, options?): Promise<FxSavePresetResult>;
```

Save an insert's current parameter state to the preset library under a name. Library state, so it is not undoable.

Requires the `fx.write` capability.

#### Parameters

##### params

[`FxSavePresetParams`](FxSavePresetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxSavePresetResult`](FxSavePresetResult.md)\>

***

### scan()

```ts
scan(params?, options?): Promise<FxScanResult>;
```

Scan the system for third-party plugins and update the app's plugin registry. Answers with a job id; settle it with `job wait`.

Requires the `fx.write` capability.

#### Parameters

##### params?

[`FxScanParams`](FxScanParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxScanResult`](FxScanResult.md)\>

***

### set()

```ts
set(params?, options?): Promise<FxSetResult>;
```

Set an insert's enabled state, bypass, or display name.

Requires the `fx.write` capability.

#### Parameters

##### params?

[`FxSetParams`](FxSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxSetResult`](FxSetResult.md)\>

***

### setParam()

```ts
setParam(params, options?): Promise<FxSetParamResult>;
```

Set one of an insert's parameters by its stable id, as a normalized 0..1 value.

Requires the `fx.write` capability.

#### Parameters

##### params

[`FxSetParamParams`](FxSetParamParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`FxSetParamResult`](FxSetParamResult.md)\>

***

### setRoom()

```ts
setRoom(params?, options?): Promise<FxSetRoomResult>;
```

Set a Sing track's Room Effect: on or off, which room, and where the voice stands in it.

Requires the `fx.write` capability.

#### Parameters

##### params?

[`FxSetRoomParams`](FxSetRoomParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxSetRoomResult`](FxSetRoomResult.md)\>
