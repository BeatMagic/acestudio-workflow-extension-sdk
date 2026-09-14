# Interface: AudioPluginExportPresetResult

Success payload of `audio-plugin export-preset`.

## Properties

### blob

```ts
blob: Uint8Array<ArrayBufferLike>;
```

Opaque bytes in the bulk envelope every bulk field on this surface travels in (`help curve-encoding`): `count` elements of `dtype`, base64 in `data`. A decoded byte length that disagrees with `count` is a hard reject, so a payload truncated in transit fails loudly instead of quietly applying a shorter state. Carried by the preset and FX-chain blob verbs — `audio-plugin export-preset` / `import-preset`, `get-state` / `set-state`, `fx export-chain` / `import-chain` — for the whole file, or the whole state, as one blob. What the bytes are is the operation's business and is said on each.

***

### extension

```ts
extension: string;
```

The file extension that container is saved under, without the dot: `acefxpreset`, `vstpreset` or `aupreset`. For a caller writing the bytes to disk.

***

### format

```ts
format: "ace" | "plugin-format";
```

The container a preset crosses the wire in. Both are files a person could also save from the app's preset menu; each is told from the other by its first bytes, which is what lets `import-preset` take either without being told. The bare state bytes inside either are not a container and are not on this list — `get-state` / `set-state` carry them.

***

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin whose state was exported.

***

### presetName?

```ts
optional presetName?: string;
```

The preset label the plugin currently shows, when it shows one. An `ace` container carries it as the preset's name; the other carries no name at all.
