# Interface: AudioPluginSetStateParams

Arguments for `audio-plugin set-state`.

## Properties

### blob

```ts
blob: Uint8Array<ArrayBufferLike>;
```

Opaque bytes in the bulk envelope every bulk field on this surface travels in (`help curve-encoding`): `count` elements of `dtype`, base64 in `data`. A decoded byte length that disagrees with `count` is a hard reject, so a payload truncated in transit fails loudly instead of quietly applying a shorter state. Carried by the preset and FX-chain blob verbs — `audio-plugin export-preset` / `import-preset`, `get-state` / `set-state`, `fx export-chain` / `import-chain` — for the whole file, or the whole state, as one blob. What the bytes are is the operation's business and is said on each.

***

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it. Session-scoped. The instrument slot is not addressed by id: its results report one, but the reserved `slot` keyword is its one address.

***

### name?

```ts
optional name?: string;
```

The preset label to show on the plugin afterwards. Without it the plugin shows no preset label.

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
