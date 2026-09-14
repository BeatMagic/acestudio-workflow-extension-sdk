# Interface: AudioPluginEditorResizeParams

Arguments for `audio-plugin editor resize`.

## Properties

### height

```ts
height: number;
```

The region's new height, in logical points.

***

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it.

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

Which index space `trackIndex` counts in: `arrangement` (the default), `video` or `marker`. Ignored beside `trackUuid`.

***

### slot?

```ts
optional slot?: string;
```

A 0-based chain position as a decimal string, or the reserved word `instrument`. Mutually exclusive with `instance`; the `fx` presentations refuse the keyword.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Milliseconds to wait for the plugin's own sizing to settle before answering `TIMEOUT`. Default 10000.

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

Track UUID in braces format, or `master` for the master bus.

***

### width

```ts
width: number;
```

The region's new width, in logical points. Held to `editor info`'s `sizeConstraints`; the plugin may clamp further, and `size` in the result is what it took.
