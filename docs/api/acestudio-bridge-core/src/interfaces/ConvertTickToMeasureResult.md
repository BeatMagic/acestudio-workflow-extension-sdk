# Interface: ConvertTickToMeasureResult

Success payload of `convert tick-to-measure`.

## Properties

### barPos

```ts
barPos: number;
```

Bar/measure counted from 0, as the project stores it. Feed it straight back to `measure-to-tick --bar-pos` or `timesig set-at --bar-pos`. Reported as `bar` counting from 1 instead under `--bars human`.

***

### beatPos?

```ts
optional beatPos?: number;
```

Beat within the bar counted from 0. Present only when considerBeatMode is true. Reported as `beat` counting from 1 instead under `--bars human`.

***

### tickOffset

```ts
tickOffset: number;
```

Tick offset within the bar (bar mode) or within the beat (beat mode).
