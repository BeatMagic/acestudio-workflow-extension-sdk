# Interface: ConvertMeasureToTickParams

Arguments for `convert measure-to-tick`.

## Properties

### barPos

```ts
barPos: number;
```

Bar/measure number (0-based, must be \>= 0).

***

### beatPos?

```ts
optional beatPos?: number | null;
```

Beat position within the bar (0-based). Required when `--consider-beat-mode` is true.

***

### considerBeatMode

```ts
considerBeatMode: boolean;
```

When true, use beat-level precision; `--beat-pos` is then required.

***

### tickOffset

```ts
tickOffset: number;
```

Tick offset within the bar (beat mode off) or within the beat (beat mode on). Must be \>= 0.
