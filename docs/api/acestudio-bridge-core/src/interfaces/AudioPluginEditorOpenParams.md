# Interface: AudioPluginEditorOpenParams

Arguments for `audio-plugin editor open`.

## Properties

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it. Session-scoped. The instrument slot is not addressed by id: its results report one, but the reserved `slot` keyword is its one address.

***

### noReveal?

```ts
optional noReveal?: boolean;
```

Refuse rather than move the user's view. `editor open` reveals by default: an editor off screen is brought back by the view move showing it needs — the caret, and the selection that rides with it, onto the plugin's track, and for a built-in the FX panel brought there with the Fx tab selected. With this set, that case answers `REVEAL_REQUIRED` instead, and nothing has moved. An editor already on screen is raised where it stands and refuses nothing. One flag for both kinds: reveal's defining act is the caret move (ADR 0152 §3), so a caller that has not checked `kind` needs no second flag.

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
