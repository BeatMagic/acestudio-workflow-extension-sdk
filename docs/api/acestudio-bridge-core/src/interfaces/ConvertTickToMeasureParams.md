# Interface: ConvertTickToMeasureParams

Arguments for `convert tick-to-measure`.

## Properties

### considerBeatMode

```ts
considerBeatMode: boolean;
```

When true, answer bar + beat + tickOffset; when false, answer bar + tickOffset only.

***

### tick

```ts
tick: number;
```

Project tick position to convert. Must be non-negative — the handler refuses a negative value.
