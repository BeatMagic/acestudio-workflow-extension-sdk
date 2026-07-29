# @timedomain/acestudio-extension-sdk

The SDK for building ACE Studio workflow extensions — the extension layer above
[`@timedomain/acestudio-bridge-core`](../acestudio-bridge-core). It owns the
extension lifecycle choreography (connect, handshake, activate, UI serving,
shutdown) so an author writes only handlers.

- `.` — the process-side entry (Node).
- `./page` — the browser-only page side of the UI channel.

The manifest is a TypeScript module, and the build emits the JSON the host and the
signer read. Its capability request is what types the client your handlers are
given, so a call your manifest did not ask for does not compile:

```ts
// manifest.ts
import type { ExtensionManifest } from "@timedomain/acestudio-extension-sdk";

export const manifest = {
  id: "acme.stem-tools",
  name: "Stem Tools",
  version: "1.0.0",
  publisher: "Acme Audio",
  lifecycle: "one-shot",
  capabilities: ["clip.read", "export.invoke"],
  entry: "dist/index.js",
} as const satisfies ExtensionManifest;
```

```ts
// index.ts — the entry ACE Studio runs
import { defineExtension } from "@timedomain/acestudio-extension-sdk";
import { manifest } from "./manifest.js";

export default defineExtension({
  manifest,
  activate: async (ctx) => {
    const { clips } = await ctx.client.clip.list({ trackIndex: 0 });
    console.log(`rendering ${clips.length} clips`);
  },
});
```

`activate` is the one entry point. What the extension does inside it is its own
business: the interface it draws is where its user decides what to run, and the
lifecycle policy decides how ACE Studio supervises the process — a `one-shot`
run is over when `activate` resolves, a `persistent` peer stays up until it is
stopped.

```ts
// build script — emit manifest.json into the bundle
import { writeManifestJson } from "@timedomain/acestudio-extension-sdk";
import { manifest } from "./manifest.js";

await writeManifestJson(manifest, "bundle");
```

> **Status:** pre-release (`0.0.0`). `defineExtension`, the TypeScript manifest,
> and the manifest-scoped client are in place; the UI paved road — loopback server,
> typed page↔process channel, media handles, `devServerUrl`, debug mode — arrives in
> later slices, as does the `./page` entry's real API. The API may still change
> before the first release.
