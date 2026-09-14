# Interface: FxOperations

The `fx` operations, mirroring the canonical operation tree 1:1.

## Methods

### add()

```ts
add(params, options?): Promise<FxAddResult>;
```

Insert an effect into a chain, by default at the end.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`FxAddParams`](FxAddParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxAddResult`](FxAddResult.md)\>

***

### applyChain()

```ts
applyChain(params, options?): Promise<FxApplyChainResult>;
```

Replace a track's chain with a saved one: every insert out, the saved inserts in, each a fresh instance carrying its saved state. One undo step.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`FxApplyChainParams`](FxApplyChainParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxApplyChainResult`](FxApplyChainResult.md)\>

***

### exportChain()

```ts
exportChain(params?, options?): Promise<FxExportChainResult>;
```

Export a chain as an `.acefxchainpreset` file, returning the file bytes.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`FxExportChainParams`](FxExportChainParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`FxExportChainResult`](FxExportChainResult.md)\>

***

### findChains()

```ts
findChains(params, options?): Promise<FxFindChainsResult>;
```

Find saved chains by name, in every folder of the library — the grep beside `list-chains`'s `ls`.

Requires the `audioplugin.read` capability.

#### Parameters

##### params

[`FxFindChainsParams`](FxFindChainsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`FxFindChainsResult`](FxFindChainsResult.md)\>

***

### importChain()

```ts
importChain(params, options?): Promise<FxImportChainResult>;
```

Import an `.acefxchainpreset` file into a chain from bytes.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`FxImportChainParams`](FxImportChainParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxImportChainResult`](FxImportChainResult.md)\>

***

### insertChain()

```ts
insertChain(params, options?): Promise<FxInsertChainResult>;
```

Insert a saved chain into a track's chain at a slot, the way dropping one onto the FX panel does: the inserts already there stay, the saved inserts arrive as fresh instances carrying their saved state. One undo step.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`FxInsertChainParams`](FxInsertChainParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxInsertChainResult`](FxInsertChainResult.md)\>

***

### listChains()

```ts
listChains(params?, options?): Promise<FxListChainsResult>;
```

List one folder of the FX chain library — the chains in it, each with a summary of its inserts, and the folders under it, the way `ls` would — or, with `recursive`, the whole tree beneath it. The chains that ship with Studio sit at the root, marked `factory`.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`FxListChainsParams`](FxListChainsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`FxListChainsResult`](FxListChainsResult.md)\>

***

### moveChain()

```ts
moveChain(params, options?): Promise<FxMoveChainResult>;
```

Move a saved chain within the library — into another folder, to a new name, or both — the file manager's `mv`, with the destination folder created on demand. Library state, so it is not undoable. Factory chains are refused.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`FxMoveChainParams`](FxMoveChainParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxMoveChainResult`](FxMoveChainResult.md)\>

***

### remove()

```ts
remove(params?, options?): Promise<FxRemoveResult>;
```

Take one insert out of a chain.

Requires the `audioplugin.write` capability.

#### Parameters

##### params?

[`FxRemoveParams`](FxRemoveParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxRemoveResult`](FxRemoveResult.md)\>

***

### removeChain()

```ts
removeChain(params, options?): Promise<FxRemoveChainResult>;
```

Remove a saved chain, sending its file to the system trash, or remove an empty folder. Library state, so it is not undoable — the trash is the undo, which is the level of destructiveness this verb is meant to have. A folder that still holds anything is refused, and so is a factory chain.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`FxRemoveChainParams`](FxRemoveChainParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxRemoveChainResult`](FxRemoveChainResult.md)\>

***

### reorder()

```ts
reorder(params, options?): Promise<FxReorderResult>;
```

Move one insert to another slot in the same chain. The plugin keeps its instance id and its DSP state.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`FxReorderParams`](FxReorderParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxReorderResult`](FxReorderResult.md)\>

***

### saveChain()

```ts
saveChain(params, options?): Promise<FxSaveChainResult>;
```

Save a chain — its plugins in order, their switches and each one's whole state — to the FX chain library at a path, creating the folders on the way. Library state, so it is not undoable.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`FxSaveChainParams`](FxSaveChainParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxSaveChainResult`](FxSaveChainResult.md)\>

***

### setRoom()

```ts
setRoom(params?, options?): Promise<FxSetRoomResult>;
```

Set a Sing track's Room Effect: on or off, which room, and where the voice stands in it.

Requires the `audioplugin.write` capability.

#### Parameters

##### params?

[`FxSetRoomParams`](FxSetRoomParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`FxSetRoomResult`](FxSetRoomResult.md)\>
