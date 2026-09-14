# Interface: GenerativeOperations

The `generative` operations, mirroring the canonical operation tree 1:1.

## Methods

### addALayer()

```ts
addALayer(params, options?): Promise<GenerativeAddALayerResult>;
```

Generate an accompaniment layer over what the project already plays.

Requires the `generative.add-a-layer` capability.

Pay-gated on `credits(add-a-layer)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeAddALayerParams`](GenerativeAddALayerParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeAddALayerResult`](GenerativeAddALayerResult.md)\>

***

### inspireMe()

```ts
inspireMe(params?, options?): Promise<GenerativeInspireMeResult>;
```

Generate a song from an idea or from lyrics. Launches a staged job.

Requires the `generative.inspire-me` capability.

Pay-gated on `credits(song-generator)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params?

[`GenerativeInspireMeParams`](GenerativeInspireMeParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeInspireMeResult`](GenerativeInspireMeResult.md)\>

***

### inspireMeHistoryGet()

```ts
inspireMeHistoryGet(params, options?): Promise<GenerativeInspireMeHistoryGetResult>;
```

One Inspire Me generation by task id, from the pages `history list` fetched.

Requires the `generative-history.read` capability.

#### Parameters

##### params

[`GenerativeInspireMeHistoryGetParams`](GenerativeInspireMeHistoryGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`GenerativeInspireMeHistoryGetResult`](GenerativeInspireMeHistoryGetResult.md)\>

***

### inspireMeHistoryList()

```ts
inspireMeHistoryList(params?, options?): Promise<GenerativeInspireMeHistoryListResult>;
```

List the account's Inspire Me results, newest first. Registers what it reads into the job ledger, so an id from here places with `job place`.

Requires the `generative-history.read` capability.

#### Parameters

##### params?

[`GenerativeInspireMeHistoryListParams`](GenerativeInspireMeHistoryListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`GenerativeInspireMeHistoryListResult`](GenerativeInspireMeHistoryListResult.md)\>

***

### musicEnhancer()

```ts
musicEnhancer(params?, options?): Promise<GenerativeMusicEnhancerResult>;
```

Re-produce the current arrangement selection as a new arrangement. Launches a staged job. Set the source first with `selection set`; the operation reads the live selection exactly as the panel does, and refuses before any credit-charged work when it is missing, degenerate, or outside the Enhancer's duration window.

Requires the `generative.music-enhancer` capability.

Pay-gated on `credits(music-enhancer)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params?

[`GenerativeMusicEnhancerParams`](GenerativeMusicEnhancerParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeMusicEnhancerResult`](GenerativeMusicEnhancerResult.md)\>

***

### musicEnhancerHistoryGet()

```ts
musicEnhancerHistoryGet(params, options?): Promise<GenerativeMusicEnhancerHistoryGetResult>;
```

One Music Enhancer generation by task id, from the pages `history list` fetched.

Requires the `generative-history.read` capability.

#### Parameters

##### params

[`GenerativeMusicEnhancerHistoryGetParams`](GenerativeMusicEnhancerHistoryGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`GenerativeMusicEnhancerHistoryGetResult`](GenerativeMusicEnhancerHistoryGetResult.md)\>

***

### musicEnhancerHistoryList()

```ts
musicEnhancerHistoryList(params?, options?): Promise<GenerativeMusicEnhancerHistoryListResult>;
```

List the account's Music Enhancer results, newest first. Registers what it reads into the job ledger, so an id from here places with `job place`.

Requires the `generative-history.read` capability.

#### Parameters

##### params?

[`GenerativeMusicEnhancerHistoryListParams`](GenerativeMusicEnhancerHistoryListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`GenerativeMusicEnhancerHistoryListResult`](GenerativeMusicEnhancerHistoryListResult.md)\>

***

### stemSplitter()

```ts
stemSplitter(params, options?): Promise<GenerativeStemSplitterResult>;
```

Split audio clips into separate stems on new tracks.

Requires the `generative.stem-splitter` capability.

Pay-gated on `credits(stem-splitter)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeStemSplitterParams`](GenerativeStemSplitterParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeStemSplitterResult`](GenerativeStemSplitterResult.md)\>

***

### vocalToMidi()

```ts
vocalToMidi(params, options?): Promise<GenerativeVocalToMidiResult>;
```

Transcribe an audio clip's vocal into notes on a Sing track.

Requires the `generative.vocal-to-midi` capability.

#### Parameters

##### params

[`GenerativeVocalToMidiParams`](GenerativeVocalToMidiParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeVocalToMidiResult`](GenerativeVocalToMidiResult.md)\>

***

### voiceChangerConvert()

```ts
voiceChangerConvert(params, options?): Promise<GenerativeVoiceChangerConvertResult>;
```

Re-sing rendered audio in one or more other voices.

Requires the `generative.voice-changer` capability.

#### Parameters

##### params

[`GenerativeVoiceChangerConvertParams`](GenerativeVoiceChangerConvertParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeVoiceChangerConvertResult`](GenerativeVoiceChangerConvertResult.md)\>

***

### voiceChangerModels()

```ts
voiceChangerModels(params?, options?): Promise<GenerativeVoiceChangerModelsResult>;
```

List the Voice Changer models this account can convert with — every id `generative voice-changer convert` accepts, across all three of the panel's pages.

Requires the `generative.voice-changer` capability.

#### Parameters

##### params?

[`GenerativeVoiceChangerModelsParams`](GenerativeVoiceChangerModelsParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeVoiceChangerModelsResult`](GenerativeVoiceChangerModelsResult.md)\>
