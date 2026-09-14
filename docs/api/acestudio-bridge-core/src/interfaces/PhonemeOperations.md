# Interface: PhonemeOperations

The `phoneme` operations, mirroring the canonical operation tree 1:1.

## Methods

### g2p()

```ts
g2p(params, options?): Promise<PhonemeG2pResult>;
```

Derive the phonemes Studio would give a grapheme, in its surrounding context.

Requires the `lyric.read` capability.

#### Parameters

##### params

[`PhonemeG2pParams`](PhonemeG2pParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`PhonemeG2pResult`](PhonemeG2pResult.md)\>

***

### inventory()

```ts
inventory(params, options?): Promise<PhonemeInventoryResult>;
```

List the phoneme symbols a language legally accepts.

Requires the `lyric.read` capability.

#### Parameters

##### params

[`PhonemeInventoryParams`](PhonemeInventoryParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`PhonemeInventoryResult`](PhonemeInventoryResult.md)\>

***

### list()

```ts
list(params?, options?): Promise<PhonemeListResult>;
```

Read what a note sings, what it would sing unedited, and where each phoneme lands.

Requires the `lyric.read` capability.

#### Parameters

##### params?

[`PhonemeListParams`](PhonemeListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`PhonemeListResult`](PhonemeListResult.md)\>

***

### moveBoundary()

```ts
moveBoundary(params, options?): Promise<PhonemeMoveBoundaryResult>;
```

Move a phoneme boundary, pinning the span it belongs to.

Requires the `lyric.write` capability.

#### Parameters

##### params

[`PhonemeMoveBoundaryParams`](PhonemeMoveBoundaryParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`PhonemeMoveBoundaryResult`](PhonemeMoveBoundaryResult.md)\>

***

### reset()

```ts
reset(params, options?): Promise<PhonemeResetResult>;
```

Clear whatever the note holds — override and timing both, unconditionally.

Requires the `lyric.write` capability.

#### Parameters

##### params

[`PhonemeResetParams`](PhonemeResetParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`PhonemeResetResult`](PhonemeResetResult.md)\>

***

### resetOverride()

```ts
resetOverride(params, options?): Promise<PhonemeResetOverrideResult>;
```

Clear the phoneme override, handing the note back to its derived pronunciation — the piano roll's emptied phoneme field.

Requires the `lyric.write` capability.

#### Parameters

##### params

[`PhonemeResetOverrideParams`](PhonemeResetOverrideParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`PhonemeResetOverrideResult`](PhonemeResetOverrideResult.md)\>

***

### resetTiming()

```ts
resetTiming(params, options?): Promise<PhonemeResetTimingResult>;
```

Clear phoneme timing and keep the phonemes — Clear all consonants and Reset Phoneme Timing, which are one concept the GUI built twice.

Requires the `lyric.write` capability.

#### Parameters

##### params

[`PhonemeResetTimingParams`](PhonemeResetTimingParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`PhonemeResetTimingResult`](PhonemeResetTimingResult.md)\>

***

### set()

```ts
set(params, options?): Promise<PhonemeSetResult>;
```

Re-spell how one note is pronounced.

Requires the `lyric.write` capability.

#### Parameters

##### params

[`PhonemeSetParams`](PhonemeSetParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`PhonemeSetResult`](PhonemeSetResult.md)\>

***

### setConsonantTiming()

```ts
setConsonantTiming(params, options?): Promise<PhonemeSetConsonantTimingResult>;
```

Set how long one head or tail consonant is.

Requires the `lyric.write` capability.

#### Parameters

##### params

[`PhonemeSetConsonantTimingParams`](PhonemeSetConsonantTimingParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`PhonemeSetConsonantTimingResult`](PhonemeSetConsonantTimingResult.md)\>
