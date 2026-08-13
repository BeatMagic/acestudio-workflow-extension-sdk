# Interface: VoiceOperations

The `voice` operations, mirroring the canonical operation tree 1:1.

## Methods

### collect()

```ts
collect(params, options?): Promise<VoiceCollectResult>;
```

Collect a community voice into your library so it can be loaded.

Requires the `voice.write` capability.

#### Parameters

##### params

[`VoiceCollectParams`](VoiceCollectParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`VoiceCollectResult`](VoiceCollectResult.md)\>

***

### community()

```ts
community(params?, options?): Promise<VoiceCommunityResult>;
```

Browse the community voice catalog, one page at a time.

Requires the `voice.read` capability.

#### Parameters

##### params?

[`VoiceCommunityParams`](VoiceCommunityParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VoiceCommunityResult`](VoiceCommunityResult.md)\>

***

### seeds()

```ts
seeds(params?, options?): Promise<VoiceSeedsResult>;
```

List the voice seeds you can put into a blend.

Requires the `voice.read` capability.

#### Parameters

##### params?

[`VoiceSeedsParams`](VoiceSeedsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VoiceSeedsResult`](VoiceSeedsResult.md)\>

***

### synthModels()

```ts
synthModels(params?, options?): Promise<VoiceSynthModelsResult>;
```

List the vocal synth models, with the languages each sings and how many voices offer it.

Requires the `voice.read` capability.

#### Parameters

##### params?

[`VoiceSynthModelsParams`](VoiceSynthModelsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VoiceSynthModelsResult`](VoiceSynthModelsResult.md)\>
