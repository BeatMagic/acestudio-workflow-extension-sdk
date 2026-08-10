# Interface: NoteOperations

The `note` operations, mirroring the canonical operation tree 1:1.

## Methods

### add()

```ts
add(params, options?): Promise<NoteAddResult>;
```

Add notes to a clip by id, with optional lyrics.

Requires the `note.write` capability.

#### Parameters

##### params

[`NoteAddParams`](NoteAddParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`NoteAddResult`](NoteAddResult.md)\>

***

### delete()

```ts
delete(params, options?): Promise<NoteDeleteResult>;
```

Delete notes by id.

Requires the `note.write` capability.

#### Parameters

##### params

[`NoteDeleteParams`](NoteDeleteParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`NoteDeleteResult`](NoteDeleteResult.md)\>

***

### get()

```ts
get(params, options?): Promise<NoteGetResult>;
```

Get one note's geometry, pitch, and type-specific fields.

Requires the `note.read` capability.

#### Parameters

##### params

[`NoteGetParams`](NoteGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`NoteGetResult`](NoteGetResult.md)\>

***

### move()

```ts
move(params, options?): Promise<NoteMoveResult>;
```

Move notes by id in time, in pitch, or both.

Requires the `note.write` capability.

#### Parameters

##### params

[`NoteMoveParams`](NoteMoveParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`NoteMoveResult`](NoteMoveResult.md)\>

***

### resize()

```ts
resize(params, options?): Promise<NoteResizeResult>;
```

Set the duration of notes addressed by id.

Requires the `note.write` capability.

#### Parameters

##### params

[`NoteResizeParams`](NoteResizeParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`NoteResizeResult`](NoteResizeResult.md)\>

***

### setArticulation()

```ts
setArticulation(params, options?): Promise<NoteSetArticulationResult>;
```

Set the articulation of Instrument-clip notes.

Requires the `note.write` capability.

#### Parameters

##### params

[`NoteSetArticulationParams`](NoteSetArticulationParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`NoteSetArticulationResult`](NoteSetArticulationResult.md)\>

***

### setLyric()

```ts
setLyric(params, options?): Promise<NoteSetLyricResult>;
```

Set the lyric (and optionally language) of Sing notes by id.

Requires the `note.write` capability.

#### Parameters

##### params

[`NoteSetLyricParams`](NoteSetLyricParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`NoteSetLyricResult`](NoteSetLyricResult.md)\>

***

### split()

```ts
split(params, options?): Promise<NoteSplitResult>;
```

Split a note in two at a position inside it.

Requires the `note.write` capability.

#### Parameters

##### params

[`NoteSplitParams`](NoteSplitParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`NoteSplitResult`](NoteSplitResult.md)\>
