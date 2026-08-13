# Interface: ClipOperations

The `clip` operations, mirroring the canonical operation tree 1:1, and the subscription that reports when the subject changes.

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

### consolidate()

```ts
consolidate(params, options?): Promise<ClipConsolidateResult>;
```

Collapse a time range into one clip per track, carrying notes and expression.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipConsolidateParams`](ClipConsolidateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipConsolidateResult`](ClipConsolidateResult.md)\>

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

### delete()

```ts
delete(params, options?): Promise<ClipDeleteResult>;
```

Delete one or more clips by UUID.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipDeleteParams`](ClipDeleteParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipDeleteResult`](ClipDeleteResult.md)\>

***

### detachAudio()

```ts
detachAudio(params, options?): Promise<ClipDetachAudioResult>;
```

Extract video clips' embedded audio onto a new audio track.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipDetachAudioParams`](ClipDetachAudioParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipDetachAudioResult`](ClipDetachAudioResult.md)\>

***

### duplicate()

```ts
duplicate(params, options?): Promise<ClipDuplicateResult>;
```

Copy a clip to another position or track.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipDuplicateParams`](ClipDuplicateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipDuplicateResult`](ClipDuplicateResult.md)\>

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

### move()

```ts
move(params, options?): Promise<ClipMoveResult>;
```

Move a clip along the timeline, keeping its length and trim.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipMoveParams`](ClipMoveParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipMoveResult`](ClipMoveResult.md)\>

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

### onChanged()

```ts
onChanged(listener): Unsubscribe;
```

A clip was added, removed, moved, trimmed, renamed, muted, or recoloured.
`changes` carries the affected clip uuids. A peer re-fetches with `clip list`,
which needs a track to address, so a uuid here names the clip and the peer
reads the track it was told about on the `tracks` channel.

Listen for changes on the `clips` channel. The event is a hint to re-read, not the new state.

Requires the `clip.read` capability — an ungranted subscription is refused at this call, not silently never delivered.

#### Parameters

##### listener

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### reattachAudio()

```ts
reattachAudio(params, options?): Promise<ClipReattachAudioResult>;
```

Restore video clips' embedded audio, leaving any extracted track.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipReattachAudioParams`](ClipReattachAudioParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipReattachAudioResult`](ClipReattachAudioResult.md)\>

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

***

### resize()

```ts
resize(params, options?): Promise<ClipResizeResult>;
```

Change a clip's start, length, or how far into its source it starts.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipResizeParams`](ClipResizeParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipResizeResult`](ClipResizeResult.md)\>

***

### set()

```ts
set(params, options?): Promise<ClipSetResult>;
```

Rename a clip or change its color.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipSetParams`](ClipSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipSetResult`](ClipSetResult.md)\>

***

### setEnabled()

```ts
setEnabled(params, options?): Promise<ClipSetEnabledResult>;
```

Enable or disable clips, silencing them without deleting them.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipSetEnabledParams`](ClipSetEnabledParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipSetEnabledResult`](ClipSetEnabledResult.md)\>

***

### setFades()

```ts
setFades(params, options?): Promise<ClipSetFadesResult>;
```

Set a clip's fade in/out, or a crossfade between two adjacent clips.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipSetFadesParams`](ClipSetFadesParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipSetFadesResult`](ClipSetFadesResult.md)\>

***

### setGain()

```ts
setGain(params, options?): Promise<ClipSetGainResult>;
```

Set the gain of an Audio or Video clip, in decibels.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipSetGainParams`](ClipSetGainParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipSetGainResult`](ClipSetGainResult.md)\>

***

### setMuted()

```ts
setMuted(params, options?): Promise<ClipSetMutedResult>;
```

Mute or unmute a video clip's embedded audio.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipSetMutedParams`](ClipSetMutedParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipSetMutedResult`](ClipSetMutedResult.md)\>

***

### split()

```ts
split(params, options?): Promise<ClipSplitResult>;
```

Split a clip into two at a position inside it.

Requires the `clip.write` capability.

#### Parameters

##### params

[`ClipSplitParams`](ClipSplitParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ClipSplitResult`](ClipSplitResult.md)\>
