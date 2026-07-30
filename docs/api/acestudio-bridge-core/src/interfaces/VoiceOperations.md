# Interface: VoiceOperations

The `voice` operations, mirroring the canonical operation tree 1:1.

## Methods

### collect()

```ts
collect(params, options?): Promise<VoiceCollectResult>;
```

Collect (favorite) a community voice so it can be loaded onto tracks.

Requires the `voice.write` capability.

#### Parameters

##### params

[`VoiceCollectParams`](VoiceCollectParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`VoiceCollectResult`](VoiceCollectResult.md)\>

***

### communityList()

```ts
communityList(params, options?): Promise<VoiceCommunityListResult>;
```

Browse a page of the community voice catalog.

Requires the `voice.read` capability.

#### Parameters

##### params

[`VoiceCommunityListParams`](VoiceCommunityListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VoiceCommunityListResult`](VoiceCommunityListResult.md)\>

***

### communityPages()

```ts
communityPages(params, options?): Promise<VoiceCommunityPagesResult>;
```

Return the total page count for the community voice catalog.

Requires the `voice.read` capability.

#### Parameters

##### params

[`VoiceCommunityPagesParams`](VoiceCommunityPagesParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VoiceCommunityPagesResult`](VoiceCommunityPagesResult.md)\>

***

### list()

```ts
list(params, options?): Promise<VoiceListResult>;
```

List locally installed sound sources (voices, choirs, instruments, ensembles).

Requires the `voice.read` capability.

#### Parameters

##### params

[`VoiceListParams`](VoiceListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VoiceListResult`](VoiceListResult.md)\>

***

### load()

```ts
load(params, options?): Promise<VoiceLoadResult>;
```

Load a sound source onto a track.

Requires the `voice.write` capability.

#### Parameters

##### params

[`VoiceLoadParams`](VoiceLoadParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`VoiceLoadResult`](VoiceLoadResult.md)\>

***

### mixCreate()

```ts
mixCreate(params, options?): Promise<VoiceMixCreateResult>;
```

Create a blended voice in the library from a recipe of seed voices.

Requires the `voice.write` capability.

#### Parameters

##### params

[`VoiceMixCreateParams`](VoiceMixCreateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`VoiceMixCreateResult`](VoiceMixCreateResult.md)\>

***

### mixDelete()

```ts
mixDelete(params, options?): Promise<VoiceMixDeleteResult>;
```

Delete a blended voice from the library.

Requires the `voice.write` capability.

#### Parameters

##### params

[`VoiceMixDeleteParams`](VoiceMixDeleteParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`VoiceMixDeleteResult`](VoiceMixDeleteResult.md)\>

***

### mixEdit()

```ts
mixEdit(params, options?): Promise<VoiceMixEditResult>;
```

Edit an existing blended voice: its recipe, name, tags, language, or avatar.

Requires the `voice.write` capability.

#### Parameters

##### params

[`VoiceMixEditParams`](VoiceMixEditParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`VoiceMixEditResult`](VoiceMixEditResult.md)\>

***

### tags()

```ts
tags(params, options?): Promise<VoiceTagsResult>;
```

Return the tag taxonomy / filter options for sound sources.

Requires the `voice.read` capability.

#### Parameters

##### params

[`VoiceTagsParams`](VoiceTagsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VoiceTagsResult`](VoiceTagsResult.md)\>

***

### unload()

```ts
unload(params, options?): Promise<VoiceUnloadResult>;
```

Unload a sound source from a track, downgrading it to Generic MIDI.

Requires the `voice.write` capability.

#### Parameters

##### params

[`VoiceUnloadParams`](VoiceUnloadParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`VoiceUnloadResult`](VoiceUnloadResult.md)\>
