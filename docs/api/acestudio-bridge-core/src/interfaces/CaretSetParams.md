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

Track index (0-based). Omitted keeps the current track.
