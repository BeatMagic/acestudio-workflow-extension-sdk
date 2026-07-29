# Function: connectChannel()

```ts
function connectChannel<P>(options?): PageChannel<P>;
```

Connect to the process this page's extension runs in.

Pass the same protocol type the process side names, exported from a module both
import — that shared type is what makes both halves of the conversation checked.

## Type Parameters

### P

`P` *extends* [`UiProtocol`](../../interfaces/UiProtocol.md)

## Parameters

### options?

[`ConnectChannelOptions`](../interfaces/ConnectChannelOptions.md) = `{}`

## Returns

[`PageChannel`](../interfaces/PageChannel.md)\<`P`\>

## Example

```ts
import { connectChannel } from "@timedomain/acestudio-extension-sdk/page";
import type { StemsUi } from "../protocol.js";

const channel = connectChannel<StemsUi>();
channel.on("progress", ({ done, total }) => setProgress(done / total));
const stems = await channel.call("listStems", { trackIndex: 0 });
```
