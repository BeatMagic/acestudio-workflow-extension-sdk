# Function: defineExtension()

```ts
function defineExtension<M>(definition, options?): Extension<M>;
```

Define an extension and start its run.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](../interfaces/ExtensionManifest.md)

## Parameters

### definition

[`ExtensionDefinition`](../interfaces/ExtensionDefinition.md)\<`M`\>

### options?

[`ExtensionRuntimeOptions`](../interfaces/ExtensionRuntimeOptions.md) = `{}`

## Returns

[`Extension`](../interfaces/Extension.md)\<`M`\>

## Example

```ts
import { defineExtension } from "@timedomain/acestudio-extension-sdk";
import { manifest } from "./manifest.js";

export default defineExtension({
  manifest,
  commands: {
    "render-stems": async (ctx) => {
      const { clips } = await ctx.client.clip.list({ trackIndex: 0 });
      console.log(`rendering ${clips.length} clips`);
    },
  },
});
```
