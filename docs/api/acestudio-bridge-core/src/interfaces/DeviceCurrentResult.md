# Interface: DeviceCurrentResult

Success payload of `device current`.

## Properties

### deviceType

```ts
deviceType: string;
```

Active audio device type/backend (e.g. CoreAudio, ASIO, Windows Audio).

***

### input

```ts
input: {
  availableChannels: string[];
  deviceName: string;
};
```

Selected input device and its channels, as `device current` reports it.

#### availableChannels

```ts
availableChannels: string[];
```

Input channel names the device exposes.

#### deviceName

```ts
deviceName: string;
```

Name of the selected input device.

***

### output

```ts
output: {
  availableChannelPairs: string[];
  currentChannelPair?: string;
  currentChannelPairIndex: number;
  deviceName: string;
};
```

Selected output device and its channel-pair state, as `device current` reports it.

#### availableChannelPairs

```ts
availableChannelPairs: string[];
```

Stereo channel pair names the device exposes.

#### currentChannelPair?

```ts
optional currentChannelPair?: string;
```

Name of the active channel pair. Absent when `currentChannelPairIndex` is out of range.

#### currentChannelPairIndex

```ts
currentChannelPairIndex: number;
```

0-based index of the active channel pair within `availableChannelPairs`; may be out of range if none is active.

#### deviceName

```ts
deviceName: string;
```

Name of the selected output device.

***

### properties

```ts
properties: {
  bufferSize: number;
  sampleRate: number;
};
```

Current device properties, as `device current` reports them.

#### bufferSize

```ts
bufferSize: number;
```

Current buffer size in samples.

#### sampleRate

```ts
sampleRate: number;
```

Current sample rate in Hz.
