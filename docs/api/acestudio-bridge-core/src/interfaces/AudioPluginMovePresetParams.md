# Interface: AudioPluginMovePresetParams

Arguments for `audio-plugin move-preset`.

## Properties

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it. Session-scoped. The instrument slot is not addressed by id: its results report one, but the reserved `slot` keyword is its one address.

***

### preset

```ts
preset: string;
```

The preset to move, by its path in the library.

***

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see `Fx.acerpc`.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video` or `marker`. The regions are isolated index spaces, so an index read against the wrong one names an unrelated track. Ignored beside `trackUuid`, which needs no region.

***

### slot?

```ts
optional slot?: string;
```

Which slot: a 0-based chain position as a decimal string, or the reserved word `instrument` naming a MIDI track's instrument slot. Mutually exclusive with `instance`. The `fx` presentations refuse the keyword — the instrument slot is not a chain insert.

***

### to

```ts
to: string;
```

Where it goes, the way `mv` takes a destination. A path that ends in `/`, or that names a folder which exists, is the folder to file the preset into under its current name; the empty string is the root. Any other path is the preset's new path — its last segment the new name, the segments before it the folder, created if missing. A `.` or `..` segment is refused. Refused with PRESET_EXISTS when a preset already sits at the destination, so a move cannot quietly produce two presets one path addresses. A destination that differs from the preset's own path only in letter case is the same path, and the move is a no-op.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, or `master` for the master bus. The definitive handle: it works in every region, where an index needs `region` to be read.
