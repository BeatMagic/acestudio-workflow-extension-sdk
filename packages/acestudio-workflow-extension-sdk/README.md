# @timedomain/acestudio-workflow-extension-sdk

Build an extension for ACE Studio, the all-in-one AI music studio. You declare what
your extension is allowed to do, write one `activate` function, and draw its interface
as a web page the app puts in a window for you. Connecting, the lifecycle, and the
channel between that page and your code are the SDK's job.

It is the extension layer above
[`@timedomain/acestudio-bridge-core`](../acestudio-bridge-core), and it owns the
lifecycle choreography (connect, handshake, activate, UI serving, shutdown) so an
author writes only handlers.

- `.` — the process-side entry (Node).
- `./page` — the browser-only page side of the UI channel.

The manifest is a TypeScript module, and the build emits the JSON the host and the
signer read. Its capability request is what types the client your handlers are
given, so a call your manifest did not ask for does not compile:

```ts
// manifest.ts
import type { ExtensionManifest } from "@timedomain/acestudio-workflow-extension-sdk";

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
import { defineExtension } from "@timedomain/acestudio-workflow-extension-sdk";
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
import type { UiProtocol } from "@timedomain/acestudio-workflow-extension-sdk";

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
import { connectChannel } from "@timedomain/acestudio-workflow-extension-sdk/page";
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

### Bytes: served assets and binary calls

Two things a JSON channel cannot express, so that neither needs a route of its own.

`ui: { assets }` declares what your extension had at build time. `ctx.ui.serveAsset()`
is the runtime half: it puts bytes on that same server at an opaque, revocable URL your
page can point an element at. Byte ranges are answered, which is what lets `<video>`
and `<audio>` seek:

```ts
const preview = ctx.ui.serveAsset("/tmp/render-42.wav");
channel.emit("previewReady", { url: preview.url });
// …once the page is done with it
preview.revoke();
```

A file path or a `Uint8Array` can be seeked inside; a `Readable` is served once,
whole. Everything served is revoked when the run ends.

Nothing is decoded or converted on the way through — the bytes go out as they came in,
under whatever `contentType` you name. And it is paved-road only: it serves from the
server the SDK is running for you, so an extension running its own server has nowhere
for it to put them, and already has the route it would need.

And a call may carry bytes in either direction — declare `Uint8Array` in the
protocol, and that is what both ends receive:

```ts
// protocol.ts
calls: {
  upload(params: { name: string; bytes: Uint8Array }): Promise<{ size: number }>;
}
```

```ts
// the page — a file the user picked
const file = input.files[0];
await channel.call("upload", { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) });
```

Events stay JSON: the event stream's framing is text, so pushing bytes is refused
at the `emit` rather than quietly stringified. Answer a call with them, or serve them
and hand the page the URL.

### Iterating on the page: `devServerUrl`

Point ACE Studio at your dev server instead of the built page, so the window shows
what your framework is hot-reloading:

```ts
ui: { assets: "dist/ui", devServerUrl: "http://127.0.0.1:5173/" }
```

It is honored **only when ACE Studio spawned the extension dev-loaded**, so a
packaged bundle that ships the field is served from `assets` as if the field were
not there. The channel and the served assets stay on the loopback server, and the SDK puts
their origin in the URL it announces — so `connectChannel()` in the page finds your
process with nothing to configure.

### Debug mode

```ts
export default defineExtension({ manifest, activate }, { debug: true });
```

Logs what the SDK does — the handshake, every call and how it ended, the channel,
the assets it serves — to stderr, which ACE Studio captures into the extension's log
folder. Defaults to what `ACE_EXTENSION_SDK_DEBUG` says, which is how dev tooling
turns it on without a rebuild.

It reports operations and the URLs the SDK serves, never what a call carried: there is
no wire trace here, on purpose. And it is the *SDK's* logging, not your extension's —
yours stays `console.*`, and this flag does nothing to it.

## Emitting the manifest

```ts
// build script — emit manifest.json into the bundle
import { writeManifestJson } from "@timedomain/acestudio-workflow-extension-sdk";
import { manifest } from "./manifest.js";

await writeManifestJson(manifest, "bundle");
```

> **Status:** published, on the `0.x` line. `defineExtension`, the TypeScript manifest,
> the manifest-scoped client, and the whole UI paved road (the typed channel, served
> assets, binary calls, `devServerUrl`, and debug mode) are in place. Until 1.0, any
> minor release may still change the API.
