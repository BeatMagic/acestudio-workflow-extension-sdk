# Interface: TrackOperations

The `track` operations, mirroring the canonical operation tree 1:1, and the subscription that reports when the subject changes.

## Methods

### auditionNote()

```ts
auditionNote(params, options?): Promise<void>;
```

Play one or more pitches on a track's sound source, then release them automatically after `duration` seconds. The safe default door: a one-shot can never leave a note sounding, because the server-side timer owes the release even when the caller never calls again.

Requires the `track.audition` capability.

#### Parameters

##### params

[`TrackAuditionNoteParams`](TrackAuditionNoteParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### auditionNoteClear()

```ts
auditionNoteClear(params?, options?): Promise<void>;
```

All-notes-off on a track: silence everything an audition left sounding, including a one-shot whose timer has not fired yet. The escape hatch after a caller — or a crashed peer — loses track of what it started.

Requires the `track.audition` capability.

#### Parameters

##### params?

[`TrackAuditionNoteClearParams`](TrackAuditionNoteClearParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### auditionNoteOff()

```ts
auditionNoteOff(params, options?): Promise<void>;
```

Release pitches started by `track audition note-on`. Releasing a pitch that is not sounding succeeds as a no-op.

Requires the `track.audition` capability.

#### Parameters

##### params

[`TrackAuditionNoteOffParams`](TrackAuditionNoteOffParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### auditionNoteOn()

```ts
auditionNoteOn(params, options?): Promise<void>;
```

Start one or more pitches on a track's sound source and hold them until a later `track audition note-off` or `note-clear`. The deliberate-hold door: choose it when the workflow needs a note to span other operations.

Requires the `track.audition` capability.

#### Parameters

##### params

[`TrackAuditionNoteOnParams`](TrackAuditionNoteOnParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### create()

```ts
create(params?, options?): Promise<TrackCreateResult>;
```

Create a track of any creatable type, optionally at a given position.

Requires the `track.write` capability.

#### Parameters

##### params?

[`TrackCreateParams`](TrackCreateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TrackCreateResult`](TrackCreateResult.md)\>

***

### delete()

```ts
delete(params?, options?): Promise<TrackDeleteResult>;
```

Delete tracks by uuid, or the current selection when none are named.

Requires the `track.write` capability.

#### Parameters

##### params?

[`TrackDeleteParams`](TrackDeleteParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TrackDeleteResult`](TrackDeleteResult.md)\>

***

### duplicate()

```ts
duplicate(params?, options?): Promise<TrackDuplicateResult>;
```

Duplicate a track with its clips and FX chain, next to the original.

Requires the `track.write` capability.

#### Parameters

##### params?

[`TrackDuplicateParams`](TrackDuplicateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TrackDuplicateResult`](TrackDuplicateResult.md)\>

***

### get()

```ts
get(params?, options?): Promise<TrackGetResult>;
```

Get comprehensive metadata for one track, by uuid or by index and region.

Requires the `track.read` capability.

#### Parameters

##### params?

[`TrackGetParams`](TrackGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TrackGetResult`](TrackGetResult.md)\>

***

### list()

```ts
list(params?, options?): Promise<TrackListResult>;
```

List tracks with their basic metadata and total count, optionally filtered to given track types.

Requires the `track.read` capability.

#### Parameters

##### params?

[`TrackListParams`](TrackListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TrackListResult`](TrackListResult.md)\>

***

### onChanged()

```ts
onChanged(listener): Unsubscribe;
```

A track was added, removed, reordered, renamed, or had a mixer property
change — in the arrangement or in either pinned band (ADR 0104). `changes`
carries the affected track uuids. A peer re-fetches with `track list`.

Listen for `tracks.changed`. The event is a hint to re-read, not the new state.

Requires the `track.read` capability — an ungranted subscription is refused at this call, not silently never delivered.

#### Parameters

##### listener

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

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

### resolve()

```ts
resolve(params?, options?): Promise<TrackResolveResult>;
```

Translate between a track's two identities in bulk.

Requires the `track.read` capability.

#### Parameters

##### params?

[`TrackResolveParams`](TrackResolveParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TrackResolveResult`](TrackResolveResult.md)\>

***

### set()

```ts
set(params?, options?): Promise<void>;
```

Update a track's mixer and display properties (color, pan, gain, mute, solo, monitor).

Requires the `track.write` capability.

#### Parameters

##### params?

[`TrackSetParams`](TrackSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### setInput()

```ts
setInput(params?, options?): Promise<TrackSetInputResult>;
```

Set what a track records from: its input channel, its MIDI input, and how chords are captured.

Requires the `track.write` capability.

#### Parameters

##### params?

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
