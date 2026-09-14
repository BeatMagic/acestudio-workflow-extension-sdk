# Interface: AudioPluginEditorDragParams

Arguments for `audio-plugin editor drag`.

## Properties

### button?

```ts
optional button?: "left" | "right";
```

Which mouse button a gesture holds.

***

### fromX

```ts
fromX: number;
```

Where the button goes down, horizontally, in plugin-region logical points.

***

### fromY

```ts
fromY: number;
```

Where the button goes down, vertically, in plugin-region logical points.

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

Modifier keys held through the gesture.

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

Milliseconds before the atom gives up with `TIMEOUT` — releasing the button where it is first. Default 10000; a drag whose legs add up to more must raise it.

***

### to

```ts
to: {
  durationMs?: number;
  x: number;
  y: number;
}[];
```

Where the held button travels, leg by leg; the release lands at the last waypoint. At least one.

#### durationMs?

```ts
optional durationMs?: number;
```

How long the held button takes to travel this leg, in milliseconds; the runtime interpolates intermediate moves over it and lets the editor's own timers run in between. Default 150. A plugin that reads drag velocity — a knob with acceleration — reads it off this.

#### x

```ts
x: number;
```

#### y

```ts
y: number;
```

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
