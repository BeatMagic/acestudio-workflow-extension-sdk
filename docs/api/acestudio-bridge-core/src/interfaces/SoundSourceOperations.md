# Interface: SoundSourceOperations

The `sound-source` operations, mirroring the canonical operation tree 1:1.

## Methods

### get()

```ts
get(params, options?): Promise<SoundSourceGetResult>;
```

Report what sound source a track carries, and how it is configured.

Requires the `soundsource.read` capability.

#### Parameters

##### params

[`SoundSourceGetParams`](SoundSourceGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`SoundSourceGetResult`](SoundSourceGetResult.md)\>

***

### list()

```ts
list(params, options?): Promise<SoundSourceListResult>;
```

List every sound source you can put on a track: voices, choirs, instruments, ensembles, external instruments.

Requires the `soundsource.read` capability.

#### Parameters

##### params

[`SoundSourceListParams`](SoundSourceListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`SoundSourceListResult`](SoundSourceListResult.md)\>

***

### load()

```ts
load(params, options?): Promise<SoundSourceLoadResult>;
```

Load a sound source onto a track, addressing it by name.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`SoundSourceLoadParams`](SoundSourceLoadParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`SoundSourceLoadResult`](SoundSourceLoadResult.md)\>

***

### set()

```ts
set(params, options?): Promise<SoundSourceSetResult>;
```

Change which vocal synth model a track's sound source sings through.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`SoundSourceSetParams`](SoundSourceSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`SoundSourceSetResult`](SoundSourceSetResult.md)\>

***

### tags()

```ts
tags(params, options?): Promise<SoundSourceTagsResult>;
```

Return the filter vocabulary for sound sources: languages, tags, instrument categories.

Requires the `soundsource.read` capability.

#### Parameters

##### params

[`SoundSourceTagsParams`](SoundSourceTagsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`SoundSourceTagsResult`](SoundSourceTagsResult.md)\>

***

### unload()

```ts
unload(params, options?): Promise<SoundSourceUnloadResult>;
```

Remove a track's sound source, leaving a plain MIDI track behind.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`SoundSourceUnloadParams`](SoundSourceUnloadParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`SoundSourceUnloadResult`](SoundSourceUnloadResult.md)\>
