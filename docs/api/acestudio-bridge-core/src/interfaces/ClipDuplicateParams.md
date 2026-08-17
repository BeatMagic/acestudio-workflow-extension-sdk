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

### trackIndex?

```ts
optional trackIndex?: number;
```

Destination track index (0-based). Defaults to the source's own track. The track must hold the clip's type.
