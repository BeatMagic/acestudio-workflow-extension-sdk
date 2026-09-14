# Interface: InstrumentOperations

The `instrument` operations, mirroring the canonical operation tree 1:1.

## Methods

### set()

```ts
set(params, options?): Promise<InstrumentSetResult>;
```

Set which MIDI channel a track's external instrument listens on.

Requires the `soundsource.write` capability.

#### Parameters

##### params

[`InstrumentSetParams`](InstrumentSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`InstrumentSetResult`](InstrumentSetResult.md)\>
