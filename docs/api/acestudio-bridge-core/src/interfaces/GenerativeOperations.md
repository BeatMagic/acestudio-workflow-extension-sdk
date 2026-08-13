# Interface: GenerativeOperations

The `generative` operations, mirroring the canonical operation tree 1:1.

## Methods

### addLayer()

```ts
addLayer(params, options?): Promise<GenerativeAddLayerResult>;
```

Generate an accompaniment layer over what the project already plays.

Requires the `generative.add-layer` capability.

Pay-gated on `credits(add-a-layer)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeAddLayerParams`](GenerativeAddLayerParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeAddLayerResult`](GenerativeAddLayerResult.md)\>

***

### enhance()

```ts
enhance(params, options?): Promise<GenerativeEnhanceResult>;
```

Re-produce existing audio as a new arrangement. Launches a staged job.

Requires the `generative.enhance` capability.

Pay-gated on `credits(music-enhancer)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeEnhanceParams`](GenerativeEnhanceParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeEnhanceResult`](GenerativeEnhanceResult.md)\>

***

### seedAudio()

```ts
seedAudio(params, options?): Promise<GenerativeSeedAudioResult>;
```

Generate audio from a prompt plus reference material onto a track.

Requires the `generative.seed-audio` capability.

Pay-gated on `credits(seed-audio)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeSeedAudioParams`](GenerativeSeedAudioParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeSeedAudioResult`](GenerativeSeedAudioResult.md)\>

***

### song()

```ts
song(params, options?): Promise<GenerativeSongResult>;
```

Generate a song from an idea or from lyrics. Launches a staged job.

Requires the `generative.song` capability.

Pay-gated on `credits(song-generator)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeSongParams`](GenerativeSongParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeSongResult`](GenerativeSongResult.md)\>

***

### soundEffects()

```ts
soundEffects(params, options?): Promise<GenerativeSoundEffectsResult>;
```

Generate a sound effect from a text prompt onto a track.

Requires the `generative.sound-effects` capability.

Pay-gated on `credits(sound-effects)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeSoundEffectsParams`](GenerativeSoundEffectsParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeSoundEffectsResult`](GenerativeSoundEffectsResult.md)\>

***

### stemSplit()

```ts
stemSplit(params, options?): Promise<GenerativeStemSplitResult>;
```

Split audio clips into separate stems on new tracks.

Requires the `generative.stem-split` capability.

Pay-gated on `credits(stem-splitter)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeStemSplitParams`](GenerativeStemSplitParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeStemSplitResult`](GenerativeStemSplitResult.md)\>

***

### text2sample()

```ts
text2sample(params, options?): Promise<GenerativeText2sampleResult>;
```

Generate an audio sample from a text prompt onto a track.

Requires the `generative.text2sample` capability.

Pay-gated on `credits(text2sample)`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`GenerativeText2sampleParams`](GenerativeText2sampleParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeText2sampleResult`](GenerativeText2sampleResult.md)\>

***

### vocal2midi()

```ts
vocal2midi(params, options?): Promise<GenerativeVocal2midiResult>;
```

Transcribe an audio clip's vocal into notes on a Sing track.

Requires the `generative.vocal2midi` capability.

#### Parameters

##### params

[`GenerativeVocal2midiParams`](GenerativeVocal2midiParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeVocal2midiResult`](GenerativeVocal2midiResult.md)\>

***

### voiceChange()

```ts
voiceChange(params, options?): Promise<GenerativeVoiceChangeResult>;
```

Re-sing rendered audio in one or more other voices.

Requires the `generative.voice-change` capability.

#### Parameters

##### params

[`GenerativeVoiceChangeParams`](GenerativeVoiceChangeParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`GenerativeVoiceChangeResult`](GenerativeVoiceChangeResult.md)\>
