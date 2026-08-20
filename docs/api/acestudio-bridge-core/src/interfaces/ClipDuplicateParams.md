# Interface: ClipDuplicateParams

Arguments for `clip duplicate`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip to copy, with or without curly braces.

***

### onOccupied?

```ts
optional onOccupied?: string;
```

What to do when the destination is occupied: `fail` (default), `cover`, or `relocate` (video only).

***

### pos?

```ts
optional pos?: number;
```

Where to place the copy, in ticks. Defaults to immediately after the source, which is where duplicating in the arrangement puts it.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video`, `marker`, or `chord`. Copying a video clip onto a chosen layer needs it — the Video band counts its own index space (ADR 0104), so an arrangement index cannot name one.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

Destination track position (0-based) in `region`. Defaults to the source's own track. The track must hold the clip's type.
