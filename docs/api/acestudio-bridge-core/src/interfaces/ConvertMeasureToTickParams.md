# Interface: ConvertMeasureToTickParams

Arguments for `convert measure-to-tick`.

## Properties

### barPos

```ts
barPos: number;
```

The same bar counted from 0, as the project stores it and as `tick-to-measure` reports it.

***

### beatPos?

```ts
optional beatPos?: number;
```

The same beat counted from 0, as `tick-to-measure` reports it.

***

### considerBeatMode

```ts
considerBeatMode: boolean;
```

When true, use beat-level precision; a beat is then required.

***

### tickOffset

```ts
tickOffset: number;
```

Tick offset within the bar (beat mode off) or within the beat (beat mode on). Must be non-negative — the handler refuses a negative value.
