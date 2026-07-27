# Interface: DeviceListResult

Success payload of `device list`.

## Properties

### availableBufferSizes

```ts
availableBufferSizes: number[];
```

Buffer sizes (samples) the current audio device supports.

***

### availableDeviceTypes

```ts
availableDeviceTypes: string[];
```

All audio device type backends the host supports.

***

### availableSampleRates

```ts
availableSampleRates: number[];
```

Sample rates (Hz) the current audio device supports.

***

### currentDeviceType

```ts
currentDeviceType: string;
```

The currently selected audio backend.

***

### inputDevices

```ts
inputDevices: object;
```

Available input devices under the current device type.

#### currentDevice

```ts
currentDevice: string;
```

Name of the selected input device.

#### devices

```ts
devices: string[];
```

All input device names; may be empty.

***

### midiInputDevices

```ts
midiInputDevices: object[];
```

MIDI input device descriptors; empty when no devices are detected.

#### availableChannels

```ts
availableChannels: number;
```

Number of MIDI channels the device supports (currently always 16).

#### deviceName

```ts
deviceName: string;
```

Device display name as reported by the OS.

***

### outputDevices

```ts
outputDevices: object;
```

Available output devices under the current device type.

#### currentDevice

```ts
currentDevice: string;
```

Name of the selected output device.

#### devices

```ts
devices: string[];
```

All output device names; may be empty.
