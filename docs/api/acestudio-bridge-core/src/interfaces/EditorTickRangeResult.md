# Interface: EditorTickRangeResult

Success payload of `editor tick-range`.

## Properties

### beginSec

```ts
beginSec: number;
```

`tickBegin` in seconds — and so the offset for local-to-global conversion in seconds, the way `tickBegin` is in ticks. It is what lifts an editor-scope reading to global seconds: `caret get`'s `sec` and `selection set`'s `rangeBeginSec` are measured from this same instant, so adding it is exact rather than a second approximation.

***

### endSec

```ts
endSec: number;
```

`tickEnd` in seconds, under the same curve.

***

### nativeUnit

```ts
nativeUnit: "tick";
```

The unit an editor range is authoritative in. Always `tick`: the open clip's extent is a scene tick range (`tickBegin`/`tickEnd` off the editor scene), so the seconds reported beside it are conversions under the current tempo curve — even when the clip being edited is an audio clip, because what this range describes is the editor's window on the grid, not the media.

***

### tickBegin

```ts
tickBegin: number;
```

Editor start position in global ticks; the offset for local-to-global conversion.

***

### tickEnd

```ts
tickEnd: number;
```

Editor end position in global ticks. Always greater than tickBegin.
