# Interface: ClipMoveEdgesParams

Arguments for `clip move-edges`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip. Accepted with or without curly braces, e.g. `\{xxxxxxxx-…\}` or `xxxxxxxx-…`.

***

### mode

```ts
mode: string;
```

Positioning mode: `diff` (relative tick offset, positive = expand, negative = shrink) or `abs` (absolute tick position).

***

### side

```ts
side: string;
```

Which edge to move: `left` or `right`.

***

### value

```ts
value: number;
```

Tick value. Interpreted as an offset when `mode=diff` and as an absolute position when `mode=abs`.
