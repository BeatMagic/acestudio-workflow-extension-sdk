# Interface: CaretSetParams

Arguments for `caret set`.

## Properties

### forceSeek?

```ts
optional forceSeek?: boolean;
```

Force playback to seek to the new position even while the transport is playing. Omitted means it does not.

***

### is\_global\_tick?

```ts
optional is_global_tick?: boolean;
```

Whether the target is in global (project-level) coordinates. False treats it as local to the open editor clip. Omitted means global. Selects the space for whichever unit was named: it reads `tick` as a local tick, and `sec` as elapsed wall clock from that clip's start.

***

### rawTrackRow?

```ts
optional rawTrackRow?: number;
```

The target row in the view's row space, for a caller that already holds screen geometry. Mutually exclusive with the other two forms — naming the same track twice has no rule for which wins, so it is refused.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Defaults to `arrangement`, which is what an unqualified index has always meant here.

***

### scope?

```ts
optional scope?: string;
```

Scope to target: `"arrangement"` / `"global"`, or `"editor"`. Omitted targets whichever view currently has focus.

***

### sec?

```ts
optional sec?: number;
```

The target in seconds instead of ticks. Must be non-negative. Converted under the tempo curve, in the coordinate space `is_global_tick` selects — so with `is_global_tick: false` this is elapsed wall clock from the open clip's start, matching what `caret get` reports under `editor` scope.

***

### set\_to\_line\_selection?

```ts
optional set_to_line_selection?: boolean;
```

Whether to snap the selection to line selection after moving. Omitted means it does.

***

### tick?

```ts
optional tick?: number;
```

Target position in ticks. Must be non-negative. One of `tick` / `sec` is required, and naming neither is refused rather than read as tick 0. When both are named `tick` wins: the caret is tick-native, so it is the value that reaches the caret with nothing rounded (ADR 0032 §5).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of the target track in `region`. Omitted keeps the current track. Mutually exclusive with `trackUuid` and `rawTrackRow`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

UUID of the target track, in braces. Names a track in any region, so it needs no `region` beside it. Mutually exclusive with `trackIndex`. `master` names the master bus, which the other two forms cannot: it has no index. The caret rests there like it does on any other row, which is what lets a master track's plugin editors park and return with it (ADR 0152 §1).
