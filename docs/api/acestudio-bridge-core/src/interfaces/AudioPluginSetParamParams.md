# Interface: AudioPluginSetParamParams

Arguments for `audio-plugin set-param`.

## Properties

### display?

```ts
optional display?: string;
```

The new value as the plugin displays it — `-3 dB`, `200 Hz`, `Bell`, `On` — the same text `audio-plugin get-params` reports as `valueText`. The host asks the plugin to read the text, verifies against the plugin's own display, and writes the value that matches; a plugin whose conversion is one-way or disagrees with its own display is searched in-process — a choice by its options, a range by bisecting on the number the display shows — until the display matches. Case, spacing and decimals are the plugin's to vary (`200 Hz` finds `200.0 Hz`); a unit the parameter does not display in, a number outside what it displays, or a name no option has is refused with INVALID_ARG rather than approximated. The result's `param.valueText` is what was achieved: a plugin that rounds its display lands on the nearest text it can show, so compare it with what you asked.

***

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it. Session-scoped. The instrument slot is not addressed by id: its results report one, but the reserved `slot` keyword is its one address.

***

### param

```ts
param: string;
```

Which parameter, as a `paramId` from `audio-plugin get-params`.

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

***

### value?

```ts
optional value?: number;
```

The new value, normalized to 0..1 — the same scale `audio-plugin get-params` reports. Plugins declare their own ranges and units, so one scale is the only one every parameter shares.
