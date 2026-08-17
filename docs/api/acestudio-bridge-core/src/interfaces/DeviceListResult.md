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
inputDevices: {
  currentDevice: string;
  devices: string[];
};
```

One direction's device catalog, as `device list` reports it: every device name the current backend exposes plus which one is selected.

#### currentDevice

```ts
currentDevice: string;
```

Name of the selected device in this direction.

#### devices

```ts
devices: string[];
```

All device names in this direction; may be empty.

***

### midiInputDevices

```ts
midiInputDevices: {
  availableChannels: number;
  deviceName: string;
}[];
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
outputDevices: {
  currentDevice: string;
  devices: string[];
};
```

One direction's device catalog, as `device list` reports it: every device name the current backend exposes plus which one is selected.

#### currentDevice

```ts
currentDevice: string;
```

Name of the selected device in this direction.

#### devices

```ts
devices: string[];
```

All device names in this direction; may be empty.
