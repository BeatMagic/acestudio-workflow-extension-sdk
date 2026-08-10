# Interface: ClipMoveParams

Arguments for `clip move`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip, with or without curly braces.

***

### moveEarlier?

```ts
optional moveEarlier?: number | null;
```

Shift the clip earlier by this much. Refused when it would start the clip before the project start.

***

### moveLater?

```ts
optional moveLater?: number | null;
```

Shift the clip later by this much. A note value (`1/4`), beats (`2b`), whole measures (`1bar`), or ticks (`480t`).

***

### onOccupied?

```ts
optional onOccupied?: string | null;
```

What to do when the destination is already occupied: `fail` (default), `cover` (trim the clips in the way, as a drag does; not for video), or `relocate` (stack on a new track above; video only).

***

### pos?

```ts
optional pos?: number | null;
```

Absolute destination for the clip's start. Ticks (`3840t`), clock time (`1.5s`, `1:23.5`), or musical position (`4.1.0`). See `help time-values`. Mutually exclusive with `--move-later` / `--move-earlier`.
