# Interface: ClipResizeParams

Arguments for `clip resize`.

## Properties

### clipIn?

```ts
optional clipIn?: number;
```

How far into the source the clip starts showing, in ticks. Trims the front without moving the clip. `clipInSec` is the right axis for this quantity and this is the tolerated one (ADR 0069 §1): the source-media axis is not on the tempo grid, so a tick head trim only means anything once measured against the tempo where the clip sits — which is what the handler does to it.

***

### clipInSec?

```ts
optional clipInSec?: number;
```

The head trim in SECONDS — the source-media axis's own unit, and the only one `setVideoClipGeometry` offered for it (ADR 0069 §1). OPTIONAL. Alone it governs; against `clipIn` the clip's native unit decides (ADR 0032 §5), which for the media clips this quantity applies to means this one.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip, with or without curly braces.

***

### dur?

```ts
optional dur?: number;
```

New length for the clip, in ticks.

***

### durSec?

```ts
optional durSec?: number;
```

New length for the clip, in seconds, measured forward from wherever this call leaves the clip's start. OPTIONAL. Alone it governs; against `dur` the clip's native unit decides (ADR 0032 §5). A non-positive value is refused, as its tick twin is.

***

### onOccupied?

```ts
optional onOccupied?: string;
```

What to do when the result would overlap another clip: `fail` (default), `cover`, or `relocate` (video only).

***

### pos?

```ts
optional pos?: number;
```

New start for the clip, in ticks.

***

### posSec?

```ts
optional posSec?: number;
```

New start for the clip, in seconds. OPTIONAL, and when present it WINS over `pos` when the clip is second-native; on a tick-native clip `pos` wins instead (ADR 0032 §5). Alone, it governs — including at 0, which is a position like any other.
