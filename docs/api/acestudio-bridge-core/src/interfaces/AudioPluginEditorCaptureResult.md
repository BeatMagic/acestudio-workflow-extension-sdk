# Interface: AudioPluginEditorCaptureResult

Success payload of `audio-plugin editor capture`.

## Properties

### height

```ts
height: number;
```

The image's height in pixels.

***

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin whose editor was captured.

***

### name?

```ts
optional name?: string;
```

The name shown for that plugin.

***

### png

```ts
png: Uint8Array<ArrayBufferLike>;
```

Opaque bytes in the bulk envelope every bulk field on this surface travels in (`help curve-encoding`): `count` elements of `dtype`, base64 in `data`. A decoded byte length that disagrees with `count` is a hard reject, so a payload truncated in transit fails loudly instead of quietly applying a shorter state. Carried by the preset and FX-chain blob verbs — `audio-plugin export-preset` / `import-preset`, `get-state` / `set-state`, `fx export-chain` / `import-chain` — for the whole file, or the whole state, as one blob. What the bytes are is the operation's business and is said on each.

***

### scale

```ts
scale: number;
```

Pixels of this image per logical point of the region, so a pixel coordinate read off it divides back to a gesture coordinate. The screen's own scale at full resolution; smaller after `maxWidth`.

***

### width

```ts
width: number;
```

The image's width in pixels — physical pixels of the region, or fewer after `maxWidth`.
