# Interface: ExtensionUi

What an extension does with the window its page lives in.

## Properties

### url

```ts
readonly url: string | undefined;
```

The URL this extension last announced, or `undefined` before it has announced
anything. Declaring `ui: { assets }` announces the served URL during startup, so
a paved-road extension finds it already set.

## Methods

### announceSurface()

```ts
announceSurface(url): Promise<void>;
```

Tell ACE Studio where this extension's page is being served, so it can show it.

The direct path for an extension that runs its own server — a framework's dev
server, a production Node server, anything that ends up with a URL. Declaring
`ui: { assets }` instead has the SDK serve the page and announce it, which is the
same call made on the extension's behalf.

Announcing again re-points the window, and becomes the URL [ExtensionUi.reload](#reload)
returns to. Studio checks the URL against its own guard first: a page somewhere
other than loopback, or on a scheme the guard does not allow, is refused here
rather than half-loaded.

#### Parameters

##### url

`string`

#### Returns

`Promise`\<`void`\>

#### Throws

BridgeError — `CAPABILITY_DENIED` when the session does not reach
`workflow.ui`, or whatever the host refused the URL with.

***

### channel()

```ts
channel<P>(): UiChannel<P>;
```

A view of the page↔process channel, typed to the protocol both sides share.

Compile-time only: every view is the one channel, so naming the protocol here
costs no runtime machinery, and two views cannot disagree about what is
registered. Name the same protocol type the page passes to `connectChannel`.

The channel is served alongside the page, so it reaches an extension that declared
`ui: { assets }`. One serving its own page serves its own page↔process traffic too,
and has no use for this.

#### Type Parameters

##### P

`P` *extends* [`UiProtocol`](UiProtocol.md)

#### Returns

[`UiChannel`](UiChannel.md)\<`P`\>

#### Example

```ts
import type { StemsUi } from "./protocol.js";

const channel = ctx.ui.channel<StemsUi>();
channel.handle("listStems", ({ trackIndex }) => stemsOf(trackIndex));
channel.emit("progress", { done: 1, total: 4 });
```

***

### navigate()

```ts
navigate(url): Promise<void>;
```

Show a different URL, leaving the announced one alone as the URL a reload
returns to. For moving *within* an extension's own UI — a wizard step, a
detail view — not for handing the window to somebody else's site.

#### Parameters

##### url

`string`

#### Returns

`Promise`\<`void`\>

***

### reload()

```ts
reload(): Promise<void>;
```

Reload the page, from the URL last announced. An extension whose page can
rebuild itself calls this after a rebuild; one that has announced nothing yet has
no page to reload, and the host says so.

#### Returns

`Promise`\<`void`\>

***

### serveAsset()

```ts
serveAsset(source, options?): ServedAsset;
```

Put bytes on the server the paved road is already running, at an opaque, revocable
URL the page can point an element at: `<video>`, `<audio>`, `<img>`.

`ui: { assets }` covers what the extension had at build time; this covers what it
makes while running. Byte ranges are answered, which is what lets a media element
seek. Nothing is decoded or converted on the way through.

#### Parameters

##### source

[`AssetSource`](../type-aliases/AssetSource.md)

##### options?

[`ServeAssetOptions`](ServeAssetOptions.md)

#### Returns

[`ServedAsset`](ServedAsset.md)

#### Throws

ExtensionError when this extension is not on the paved road — there is no
server of ours to put it on, and an extension running its own already has a route —
or when the run has stopped serving, since the port is gone and a URL naming it
would resolve to nothing.

#### Example

```ts
const preview = ctx.ui.serveAsset("/tmp/render-42.wav");
channel.emit("previewReady", { url: preview.url });
// …once the page is done with it
preview.revoke();
```
