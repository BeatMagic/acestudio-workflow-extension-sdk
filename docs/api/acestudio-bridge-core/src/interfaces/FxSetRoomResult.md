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

0-based index of the track.

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
