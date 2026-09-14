# Interface: AudioPluginEditorWheelParams

Arguments for `audio-plugin editor wheel`.

## Properties

### deltaX?

```ts
optional deltaX?: number;
```

Horizontal scroll, in lines; positive scrolls right. Default 0.

***

### deltaY?

```ts
optional deltaY?: number;
```

Vertical scroll, in lines; positive is the wheel rolled away from the user — up. Default 0. At least one delta must be non-zero.

***

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it.

***

### modifiers?

```ts
optional modifiers?: ("shift" | "ctrl" | "alt" | "meta")[];
```

Modifier keys held through the scroll.

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

Track UUID in braces format, or `master` for the master bus.

***

### x

```ts
x: number;
```

Horizontal position, in plugin-region logical points.

***

### y

```ts
y: number;
```

Vertical position, in plugin-region logical points.
