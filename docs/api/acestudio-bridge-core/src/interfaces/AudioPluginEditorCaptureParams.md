# Interface: AudioPluginEditorCaptureParams

Arguments for `audio-plugin editor capture`.

## Properties

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it. Session-scoped. The instrument slot is not addressed by id.

***

### maxWidth?

```ts
optional maxWidth?: number;
```

Downscale the image so its width is at most this many pixels, keeping the aspect ratio — a cheap grounding frame for a vision model's input budget. The result's `scale` then says how many of ITS pixels make one logical point, so coordinates still divide back. Absent: full resolution, one pixel per physical pixel.

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

Which index space `trackIndex` counts in: `arrangement` (the default), `video` or `marker`. Ignored beside `trackUuid`, which needs no region.

***

### slot?

```ts
optional slot?: string;
```

Which slot: a 0-based chain position as a decimal string, or the reserved word `instrument` naming a MIDI track's instrument slot. Mutually exclusive with `instance`. The `fx` presentations refuse the keyword — the instrument slot is not a chain insert.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Milliseconds before the atom gives up with `TIMEOUT`. Default 10000.

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
