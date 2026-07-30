# Interface: DeviceSetAudioResult

Success payload of `device set-audio`.

## Properties

### deviceType

```ts
deviceType: string;
```

Active audio device type/backend after the call.

***

### inputDevice

```ts
inputDevice: string;
```

Selected input device after the call. May be empty when the backend has no separate input.

***

### outputDevice

```ts
outputDevice: string;
```

Selected output device after the call.
