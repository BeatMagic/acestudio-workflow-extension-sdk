# Interface: ConvertTickToMeasureResult

Success payload of `convert tick-to-measure`.

## Properties

### barPos

```ts
barPos: number;
```

Bar/measure number (0-based).

***

### beatPos?

```ts
optional beatPos?: number;
```

Beat position within the bar (0-based). Present only when considerBeatMode is true.

***

### tickOffset

```ts
tickOffset: number;
```

Tick offset within the bar (bar mode) or within the beat (beat mode).
