# Interface: FxSetRoomParams

Arguments for `fx set-room`.

## Properties

### enabled?

```ts
optional enabled?: boolean;
```

Turn the Room Effect on or off.

***

### positionX?

```ts
optional positionX?: number;
```

Left/right position in metres, 0 at the centre. Must be given with `positionY`.

***

### positionY?

```ts
optional positionY?: number;
```

Front/back position in metres, 0 at the centre. Must be given with `positionX`.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format.

***

### type?

```ts
optional type?: "studio-room" | "choir-hall" | "church";
```

Which room the Room Effect places the voice in. The spellings are this surface's own, not the plugin's display text.
