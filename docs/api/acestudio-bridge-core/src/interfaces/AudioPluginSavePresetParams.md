# Interface: AudioPluginSavePresetParams

Arguments for `audio-plugin save-preset`.

## Properties

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it. Session-scoped. The instrument slot is not addressed by id: its results report one, but the reserved `slot` keyword is its one address.

***

### overwrite?

```ts
optional overwrite?: boolean;
```

Replace the preset already at that path. Without it, a collision is refused rather than silently replacing someone's preset.

***

### preset

```ts
preset: string;
```

Where the save lands: a path in the plugin's preset library — folder segments, then the file's basename — `Vocals/Warm Verb`, or a bare name for the directory's own root. Folders that do not exist yet are created. Each segment is sanitized for the filesystem, and the result reports the path that was actually written. A `.` or `..` segment is refused: a path is named here, never navigated to.

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
