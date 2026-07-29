# Function: writeManifestJson()

```ts
function writeManifestJson(manifest, outputDir): Promise<string>;
```

Write `manifest.json` into `outputDir` (creating it if needed) and return the
path written. The one call an extension's build script needs.

## Parameters

### manifest

[`ExtensionManifest`](../interfaces/ExtensionManifest.md)

### outputDir

`string`

## Returns

`Promise`\<`string`\>

## Throws

ExtensionError if the manifest would not install.
