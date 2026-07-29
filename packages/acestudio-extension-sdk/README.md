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

## The UI paved road

Declare `ui: { assets }` and the SDK serves your built page on loopback, announces
its URL to ACE Studio, and carries a typed channel between that page and your
process. Declare one protocol type, import it from both sides, and both halves of
the conversation are checked:

```ts
// protocol.ts — imported by the process and by the page
import type { UiProtocol } from "@timedomain/acestudio-extension-sdk";

export interface StemsUi extends UiProtocol {
  calls: {
    listStems(params: { trackIndex: number }): Promise<string[]>;
  };
  events: {
    progress: { done: number; total: number };
  };
}
```

```ts
// index.ts — the process side
export default defineExtension({
  manifest,
  ui: { assets: "dist/ui" },
  activate: (ctx) => {
    const channel = ctx.ui.channel<StemsUi>();
    channel.handle("listStems", ({ trackIndex }) => stemsOf(trackIndex));
    channel.emit("progress", { done: 1, total: 4 });
  },
});
```

```ts
// ui/main.ts — the page side, from the browser-only subpath
import { connectChannel } from "@timedomain/acestudio-extension-sdk/page";
import type { StemsUi } from "../protocol.js";

const channel = connectChannel<StemsUi>();
channel.on("progress", ({ done, total }) => setProgress(done / total));
const stems = await channel.call("listStems", { trackIndex: 0 });
```

It is a convenience, not the way in: an extension that runs its own server — a
framework's production server, a dev server — leaves `ui` out and calls
`ctx.ui.announceSurface(url)` with its own URL instead. Either way ACE Studio owns
the window, and `ctx.ui.reload()` / `ctx.ui.navigate(url)` are how you ask it to
re-point what it is showing.

## Emitting the manifest

```ts
// build script — emit manifest.json into the bundle
import { writeManifestJson } from "@timedomain/acestudio-extension-sdk";
import { manifest } from "./manifest.js";

await writeManifestJson(manifest, "bundle");
```

> **Status:** pre-release (`0.0.0`). `defineExtension`, the TypeScript manifest, the
> manifest-scoped client, and the UI paved road are in place. Media handles,
> `devServerUrl`, and debug mode arrive in later slices. The API may still change
> before the first release.
