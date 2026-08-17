# Interface: DeviceSetAudioParams

Arguments for `device set-audio`.

## Properties

### deviceType?

```ts
optional deviceType?: string;
```

Audio backend to use, from `availableDeviceTypes` in `device list` (e.g. `CoreAudio`, `ASIO`, `Windows Audio`).

***

### inputDevice?

```ts
optional inputDevice?: string;
```

Input device name, from `inputDevices.devices` in `device list`. Recording needs one of these.

***

### outputDevice?

```ts
optional outputDevice?: string;
```

Output device name, from `outputDevices.devices` in `device list`.
