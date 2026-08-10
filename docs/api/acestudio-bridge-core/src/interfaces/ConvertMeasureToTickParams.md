# Interface: ConvertMeasureToTickParams

Arguments for `convert measure-to-tick`.

## Properties

### barPos

```ts
barPos: number;
```

The same bar counted from 0, as the project stores it and as `tick-to-measure` reports it. This is the spelling the wire takes. `acestudio-cli` and MCP also accept `bar` counting from 1, folding it to this before the call; pass one or the other, never both.

***

### beatPos?

```ts
optional beatPos?: number | null;
```

The same beat counted from 0, as `tick-to-measure` reports it. This is the spelling the wire takes; `beat` counting from 1 is accepted by `acestudio-cli` and MCP. Pass one or the other, never both.

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

Tick offset within the bar (beat mode off) or within the beat (beat mode on). Must be \>= 0.
