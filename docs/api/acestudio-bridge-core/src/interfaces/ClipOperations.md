# Interface: ClipOperations

The `clip` operations, mirroring the canonical operation tree 1:1.

## Methods

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

### create()

```ts
create(params, options?): Promise<ClipCreateResult>;
```

Place a new note clip on a track, optionally with initial notes.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipCreateParams`](ClipCreateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipCreateResult`](ClipCreateResult.md)\>

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

***

### replaceContent()

```ts
replaceContent(params, options?): Promise<ClipReplaceContentResult>;
```

Replace a clip's notes wholesale with a new set.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipReplaceContentParams`](ClipReplaceContentParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`ClipReplaceContentResult`](ClipReplaceContentResult.md)\>
