# Interface: InstrumentOperations

The `instrument` operations, mirroring the canonical operation tree 1:1.

## Methods

### disable()

```ts
disable(params?, options?): Promise<InstrumentDisableResult>;
```

Disable the external instrument mounted on a MIDI track, leaving it mounted.

Requires the `soundsource.write` capability.

#### Parameters

##### params?

[`InstrumentDisableParams`](InstrumentDisableParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`InstrumentDisableResult`](InstrumentDisableResult.md)\>

***

### enable()

```ts
enable(params?, options?): Promise<InstrumentEnableResult>;
```

Enable the external instrument mounted on a MIDI track.

Requires the `soundsource.write` capability.

#### Parameters

##### params?

[`InstrumentEnableParams`](InstrumentEnableParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`InstrumentEnableResult`](InstrumentEnableResult.md)\>

***

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
