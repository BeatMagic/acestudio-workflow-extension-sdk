# Interface: ClipSetGainParams

Arguments for `clip set-gain`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip. Must be an Audio or Video clip.

***

### gain

```ts
gain: number;
```

Clip gain in decibels: `0` is unity, negative values attenuate. The writable domain is the audio-clip gain range, -70 to +30 (`AudioGainConstantConfig::LEVEL_MIN` … `LEVEL_MAX`) — the range the clip's own gain control drags through, wider than a track's -70 to +6. Out-of-range values are refused with `INVALID_ARG`, not clamped.
