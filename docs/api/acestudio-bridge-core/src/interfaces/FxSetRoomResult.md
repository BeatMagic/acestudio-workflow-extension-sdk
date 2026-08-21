# Interface: FxSetRoomResult

Success payload of `fx set-room`.

## Properties

### enabled

```ts
enabled: boolean;
```

Whether the Room Effect is on.

***

### positionX

```ts
positionX: number;
```

Left/right position in metres, 0 at the centre.

***

### positionY

```ts
positionY: number;
```

Front/back position in metres, 0 at the centre.

***

### region

```ts
region: string;
```

Which index space `trackIndex` counts in. Always `arrangement` here: the Room Effect is a Sing-track property and Sing tracks live only in the arrangement. Reported rather than implied so a caller reading any `trackIndex` on this surface can read its space off the same result (ADR 0129 §2).

***

### roomDepth?

```ts
optional roomDepth?: number;
```

Depth of the current room in metres.

***

### roomWidth?

```ts
optional roomWidth?: number;
```

Width of the current room in metres. A position is valid within plus or minus half of this.

***

### trackIndex

```ts
trackIndex: number;
```

0-based position of the track in `region`.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.

***

### type

```ts
type: "studio-room" | "choir-hall" | "church";
```

Which room the Room Effect places the voice in. The spellings are this surface's own, not the plugin's display text.
