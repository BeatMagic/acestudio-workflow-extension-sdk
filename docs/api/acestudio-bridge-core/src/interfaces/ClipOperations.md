# Interface: ClipOperations

The `clip` operations, mirroring the canonical operation tree 1:1.

## Methods

### add()

```ts
add(params, options?): Promise<ClipAddResult>;
```

Place a new empty note clip on a track at a given position.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipAddParams`](ClipAddParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipAddResult`](ClipAddResult.md)\>

***

### audioContent()

```ts
audioContent(params, options?): Promise<ClipAudioContentResult>;
```

Get audio file name and loading state for an Audio clip.

Requires the `clip.read` capability.

#### Parameters

##### params

[`ClipAudioContentParams`](ClipAudioContentParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ClipAudioContentResult`](ClipAudioContentResult.md)\>

***

### get()

```ts
get(params, options?): Promise<ClipGetResult>;
```

Get full metadata for one clip (geometry, color, enabled state).

Requires the `clip.read` capability.

#### Parameters

##### params

[`ClipGetParams`](ClipGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ClipGetResult`](ClipGetResult.md)\>

***

### list()

```ts
list(params, options?): Promise<ClipListResult>;
```

List all clips on a content track with basic metadata.

Requires the `clip.read` capability.

#### Parameters

##### params

[`ClipListParams`](ClipListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ClipListResult`](ClipListResult.md)\>

***

### lyrics()

```ts
lyrics(params, options?): Promise<ClipLyricsResult>;
```

Get sentence-level lyrics for a Sing clip.

Requires the `clip.read` capability.

#### Parameters

##### params

[`ClipLyricsParams`](ClipLyricsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ClipLyricsResult`](ClipLyricsResult.md)\>

***

### moveEdges()

```ts
moveEdges(params, options?): Promise<ClipMoveEdgesResult>;
```

Move the left or right edge of a clip by UUID (diff or absolute).

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipMoveEdgesParams`](ClipMoveEdgesParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipMoveEdgesResult`](ClipMoveEdgesResult.md)\>

***

### noteContent()

```ts
noteContent(params, options?): Promise<ClipNoteContentResult>;
```

Get note data for a Sing, Instrument, or GenericMidi clip.

Requires the `clip.read` capability.

#### Parameters

##### params

[`ClipNoteContentParams`](ClipNoteContentParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ClipNoteContentResult`](ClipNoteContentResult.md)\>
