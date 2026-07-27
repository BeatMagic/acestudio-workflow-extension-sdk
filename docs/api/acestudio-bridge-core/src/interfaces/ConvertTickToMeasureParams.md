# Interface: ConvertTickToMeasureParams

Arguments for `convert tick-to-measure`.

## Properties

### considerBeatMode

```ts
considerBeatMode: boolean;
```

When true, return bar + beat + tickOffset; when false, return bar + tickOffset only.

***

### tick

```ts
tick: number;
```

Project tick position to convert (must be \>= 0).
