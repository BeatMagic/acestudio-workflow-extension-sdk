# Interface: AudioPluginEditorCloseParams

Arguments for `audio-plugin editor close`.

## Properties

### force?

```ts
optional force?: boolean;
```

Close even though the editor is off screen. `editor close` runs the user's × gesture, which clears the track's memory with the window, so an editor that is off screen because the caret is on another track has no × the user could click — and the close would edit a layout they cannot see. That case is refused with `EDITOR_PARKED`; set this to close it anyway, when the user has actually asked for it. The rule is the caret for a built-in's inline body too, which has no memory for `parked` to read, so one flag serves both kinds.

***

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it. Session-scoped. The instrument slot is not addressed by id: its results report one, but the reserved `slot` keyword is its one address.

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
