# Interface: DeviceOperations

The `device` operations, mirroring the canonical operation tree 1:1.

## Methods

### current()

```ts
current(options?): Promise<DeviceCurrentResult>;
```

Read the active audio device: type, output/input device names, channel selection, sample rate, and buffer size.

Requires the `device.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`DeviceCurrentResult`](DeviceCurrentResult.md)\>

***

### list()

```ts
list(options?): Promise<DeviceListResult>;
```

List available audio devices (types, sample rates, buffer sizes) and MIDI input devices.

Requires the `device.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`DeviceListResult`](DeviceListResult.md)\>

***

### setAudio()

```ts
setAudio(params?, options?): Promise<DeviceSetAudioResult>;
```

Select the audio backend, output device, and input device by name.

Requires the `device.write` capability.

#### Parameters

##### params?

[`DeviceSetAudioParams`](DeviceSetAudioParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`DeviceSetAudioResult`](DeviceSetAudioResult.md)\>
