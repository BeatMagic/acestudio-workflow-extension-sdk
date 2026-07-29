# Interface: UiChannel\<P\>

The process's half of the channel, typed to the protocol both sides share.

## Type Parameters

### P

`P` *extends* [`UiProtocol`](UiProtocol.md)

## Methods

### emit()

```ts
emit<K>(name, ...payload): void;
```

Push one of the protocol's `events` to every page currently connected.

A push with no page listening is dropped rather than queued: an extension's
window is opened by the user, and a progress bar's history is not what they want
to see when they open it. Emit what is true now, and let a page that just
connected ask.

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### name

`K`

##### payload

...[`EmitArgs`](../type-aliases/EmitArgs.md)\<[`EventsOf`](../type-aliases/EventsOf.md)\<`P`\>\[`K`\]\>

#### Returns

`void`

#### Throws

ExtensionError when the payload carries bytes. The event stream's framing
is text, so a `Uint8Array` in a push would arrive as an object of numbered keys —
answer a `call` with the bytes, or serve them and hand the page the URL.

***

### handle()

```ts
handle<K>(name, handler): void;
```

Answer one of the protocol's `calls`. The handler's parameters and result come
from the declaration, so a handler that answers the wrong shape does not
compile.

One handler per name: registering a second for a name already handled throws,
because the two cannot both be what the page reaches and picking one silently
would make the loser look like it never ran.

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### name

`K`

##### handler

[`CallHandler`](../type-aliases/CallHandler.md)\<[`CallsOf`](../type-aliases/CallsOf.md)\<`P`\>, `K`\>

#### Returns

`void`
