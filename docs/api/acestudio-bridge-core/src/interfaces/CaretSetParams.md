# Interface: CaretSetParams

Arguments for `caret set`.

## Properties

### forceSeek?

```ts
optional forceSeek?: boolean | null;
```

Force playback to seek to the new position even if the transport is currently playing. Defaults to `false`.

***

### is\_global\_tick?

```ts
optional is_global_tick?: boolean | null;
```

Whether `tick` is in global (project-level) coordinates. When `false`, `tick` is treated as a local tick inside the open editor clip. Defaults to `true`.

***

### scope?

```ts
optional scope?: string | null;
```

Scope to target: `"arrangement"` / `"global"` or `"editor"`. Defaults to whichever view currently has focus.

***

### set\_to\_line\_selection?

```ts
optional set_to_line_selection?: boolean | null;
```

Whether to snap the selection to line selection after moving. Defaults to `true`.

***

### tick

```ts
tick: number;
```

Target position. Ticks (`3840t`), clock time (`1.5s`, `1:23.5`), or musical position (`4.1.0`). Must be non-negative. Required. See `help time-values`.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

Track index (0-based). When omitted, the current track is kept. Users see tracks starting from 1, so user "track 2" = `--track-index 1`.
