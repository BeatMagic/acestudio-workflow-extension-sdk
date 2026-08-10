# Interface: ClipResizeParams

Arguments for `clip resize`.

## Properties

### clipIn?

```ts
optional clipIn?: number | null;
```

How far into the source the clip starts showing. Trims the front without moving the clip. For an audio or video clip this is the offset into the media file; for a note clip, into its authored content.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip, with or without curly braces.

***

### dur?

```ts
optional dur?: number | null;
```

New length for the clip. A note value (`1/4`), beats (`2b`), measures (`2bar`, anchored at the clip's start), or ticks (`1920t`).

***

### onOccupied?

```ts
optional onOccupied?: string | null;
```

What to do when the result would overlap another clip: `fail` (default), `cover`, or `relocate` (video only).

***

### pos?

```ts
optional pos?: number | null;
```

New start for the clip. Ticks (`3840t`), clock time (`1.5s`), or musical position (`4.1.0`). See `help time-values`.
