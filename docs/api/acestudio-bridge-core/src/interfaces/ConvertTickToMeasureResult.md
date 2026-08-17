# Interface: ConvertTickToMeasureResult

Success payload of `convert tick-to-measure`.

## Properties

### barPos

```ts
barPos: number;
```

Bar/measure counted from 0, as the project stores it. Feed it straight back to `measure-to-tick`'s `barPos` or to `timesig set-at`'s `barPos`.

***

### beatPos?

```ts
optional beatPos?: number;
```

Beat within the bar counted from 0. Present only when `considerBeatMode` was true.

***

### tickOffset

```ts
tickOffset: number;
```

Tick offset within the bar (bar mode) or within the beat (beat mode).
