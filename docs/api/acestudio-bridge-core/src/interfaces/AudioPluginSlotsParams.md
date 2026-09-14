# Interface: AudioPluginSlotsParams

Arguments for `audio-plugin slots`.

## Properties

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

### role?

```ts
optional role?: "effect" | "instrument";
```

What a plugin is hosted to do: process audio in a chain, or produce it in a MIDI track's instrument slot. The registry holds both; the `role` filters narrow a listing to one.

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
