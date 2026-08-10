# Interface: TrackOperations

The `track` operations, mirroring the canonical operation tree 1:1.

## Methods

### create()

```ts
create(params, options?): Promise<TrackCreateResult>;
```

Create a track of any creatable type, optionally at a given position.

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackCreateParams`](TrackCreateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TrackCreateResult`](TrackCreateResult.md)\>

***

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

### duplicate()

```ts
duplicate(params, options?): Promise<TrackDuplicateResult>;
```

Duplicate a track with its clips and FX chain, next to the original.

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackDuplicateParams`](TrackDuplicateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TrackDuplicateResult`](TrackDuplicateResult.md)\>

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

### reorder()

```ts
reorder(params, options?): Promise<TrackReorderResult>;
```

Move a track to another position within its own region.

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackReorderParams`](TrackReorderParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TrackReorderResult`](TrackReorderResult.md)\>

***

### set()

```ts
set(params, options?): Promise<void>;
```

Update a track's mixer and display properties (color, pan, gain, mute, solo, monitor).

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackSetParams`](TrackSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### setInput()

```ts
setInput(params, options?): Promise<TrackSetInputResult>;
```

Set what a track records from: its input channel, its MIDI input, and how chords are captured.

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackSetInputParams`](TrackSetInputParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TrackSetInputResult`](TrackSetInputResult.md)\>

***

### setLanguage()

```ts
setLanguage(params, options?): Promise<void>;
```

Set the default lyric language for new notes on a Sing track.

Requires the `track.write` capability.

#### Parameters

##### params

[`TrackSetLanguageParams`](TrackSetLanguageParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
