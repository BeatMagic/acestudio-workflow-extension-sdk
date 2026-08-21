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

Whether `tick` is in global (project-level) coordinates. False treats it as a tick local to the open editor clip. Omitted means global.

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

### set\_to\_line\_selection?

```ts
optional set_to_line_selection?: boolean;
```

Whether to snap the selection to line selection after moving. Omitted means it does.

***

### tick

```ts
tick: number;
```

Target position in ticks. Must be non-negative.

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

UUID of the target track, in braces. Names a track in any region, so it needs no `region` beside it. Mutually exclusive with `trackIndex`.
