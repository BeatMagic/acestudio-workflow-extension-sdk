# Interface: DeviceSetAudioParams

Arguments for `device set-audio`.

## Properties

### deviceType?

```ts
optional deviceType?: string | null;
```

Audio backend to use, from `availableDeviceTypes` in `device list` (e.g. `CoreAudio`, `ASIO`, `Windows Audio`).

***

### inputDevice?

```ts
optional inputDevice?: string | null;
```

Input device name, from `inputDevices.devices` in `device list`. Recording needs one of these.

***

### outputDevice?

```ts
optional outputDevice?: string | null;
```

Output device name, from `outputDevices.devices` in `device list`.
