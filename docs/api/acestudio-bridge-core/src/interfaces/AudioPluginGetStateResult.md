# Interface: AudioPluginGetStateResult

Success payload of `audio-plugin get-state`.

## Properties

### blob

```ts
blob: Uint8Array<ArrayBufferLike>;
```

Opaque bytes in the bulk envelope every bulk field on this surface travels in (`help curve-encoding`): `count` elements of `dtype`, base64 in `data`. A decoded byte length that disagrees with `count` is a hard reject, so a payload truncated in transit fails loudly instead of quietly applying a shorter state. Carried by the preset and FX-chain blob verbs — `audio-plugin export-preset` / `import-preset`, `get-state` / `set-state`, `fx export-chain` / `import-chain` — for the whole file, or the whole state, as one blob. What the bytes are is the operation's business and is said on each.

***

### dirty

```ts
dirty: boolean;
```

Whether the state has drifted from that preset since it was applied — the `*` the app's preset bar shows. False when no preset is shown.

***

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin that was read.

***

### presetName?

```ts
optional presetName?: string;
```

The preset label the plugin currently shows, when it shows one.
