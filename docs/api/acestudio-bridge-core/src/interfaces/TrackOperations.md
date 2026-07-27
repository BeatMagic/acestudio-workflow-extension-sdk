# Interface: TrackOperations

The `track` operations, mirroring the canonical operation tree 1:1.

## Methods

### delete()

```ts
delete(options?): Promise<void>;
```

Delete all currently selected tracks and their content.

Requires the `track.write` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### get()

```ts
get(params, options?): Promise<TrackGetResult>;
```

Get comprehensive metadata for one track by index.

Requires the `track.read` capability.

#### Parameters

##### params

[`TrackGetParams`](TrackGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TrackGetResult`](TrackGetResult.md)\>

***

### list()

```ts
list(options?): Promise<TrackListResult>;
```

List all content tracks with their basic metadata and total count.

Requires the `track.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TrackListResult`](TrackListResult.md)\>

***

### rename()

```ts
rename(params, options?): Promise<void>;
```

Rename a track. Pass an empty string to restore the default name.

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackRenameParams`](TrackRenameParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### set()

```ts
set(params, options?): Promise<void>;
```

Update a track's mixer and display properties (color, pan, gain, mute, solo).

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackSetParams`](TrackSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### setRecord()

```ts
setRecord(params, options?): Promise<void>;
```

Set per-track record-input configuration (listen, audio channel, MIDI source, record mode).

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackSetRecordParams`](TrackSetRecordParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### singerRecipe()

```ts
singerRecipe(params, options?): Promise<TrackSingerRecipeResult>;
```

Read the voice-blend (singer recipe) for a singer on a Sing track.

Requires the `track.read` capability.

#### Parameters

##### params

[`TrackSingerRecipeParams`](TrackSingerRecipeParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TrackSingerRecipeResult`](TrackSingerRecipeResult.md)\>
