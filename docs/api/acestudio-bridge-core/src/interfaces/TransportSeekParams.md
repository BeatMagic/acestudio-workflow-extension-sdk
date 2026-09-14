# Interface: TransportSeekParams

Arguments for `transport seek`.

## Properties

### tick?

```ts
optional tick?: number;
```

The target in project ticks instead of seconds. Must be non-negative. Converted under the tempo curve, because the playhead does not store ticks.

***

### time?

```ts
optional time?: number;
```

Time position in seconds from the start of the project. Must be non-negative. One of `time` / `tick` is required, and naming neither is refused rather than read as 0. When both are named `time` wins: the playhead is second-native, so seconds is the spelling the seek applies with nothing rounded (ADR 0032 §5). That is the native-unit rule, not a seconds preference — `caret set` resolves the other way, its target being tick-native.
