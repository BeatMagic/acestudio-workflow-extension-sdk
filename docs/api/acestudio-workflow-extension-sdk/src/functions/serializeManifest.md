# Function: serializeManifest()

```ts
function serializeManifest(manifest): string;
```

The manifest as JSON, ready for the bundle root: `manifestVersion` and
`sdkApiVersion` stamped, keys in a fixed order, one trailing newline.

## Parameters

### manifest

[`ExtensionManifest`](../interfaces/ExtensionManifest.md)

## Returns

`string`

## Throws

ExtensionError listing every problem the host would refuse this manifest
for.
