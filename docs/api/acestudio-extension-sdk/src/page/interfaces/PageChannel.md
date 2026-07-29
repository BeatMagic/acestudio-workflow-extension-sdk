# Interface: PageChannel\<P\>

The page's half of the channel, typed to the protocol both sides share.

## Type Parameters

### P

`P` *extends* [`UiProtocol`](../../interfaces/UiProtocol.md)

## Methods

### call()

```ts
call<K>(name, ...args): Promise<ResultOf<CallsOf<P>, K>>;
```

Ask the process one of the protocol's `calls` and wait for its answer.

There is no timeout, deliberately: only the extension's author knows which of
their calls should answer in 200 ms and which is a forty-minute render, and a
timeout the SDK picked would abandon the honest one. Pass `signal` to give a call
a deadline, or show a cancel control and abort it.

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### name

`K`

##### args

...[`CallArgs`](../type-aliases/CallArgs.md)\<[`ParamsOf`](../../type-aliases/ParamsOf.md)\<[`CallsOf`](../../type-aliases/CallsOf.md)\<`P`\>, `K`\>\>

#### Returns

`Promise`\<[`ResultOf`](../../type-aliases/ResultOf.md)\<[`CallsOf`](../../type-aliases/CallsOf.md)\<`P`\>, `K`\>\>

#### Throws

Error when the handler threw, when nothing handles that name, or when the
process cannot be reached. The message is the one the process reported.

***

### close()

```ts
close(): void;
```

Stop listening and stop re-opening the stream. Calls already in flight are left
to finish. A page being torn down does not have to call this — closing the page
closes the stream — but a component that mounts and unmounts should.

#### Returns

`void`

***

### on()

```ts
on<K>(name, listener): () => void;
```

Listen for one of the protocol's `events`. Returns how to stop listening.

Only what the process pushes from now on: an event emitted before this page
connected was not queued for it, so a page that needs current state asks for it
with a `call`.

Unsubscribing stops the listener, not the stream — the connection stays open so a
component that remounts resumes without a reconnect gap. [PageChannel.close](#close)
is what releases it.

#### Type Parameters

##### K

`K` *extends* `string`

#### Parameters

##### name

`K`

##### listener

(`payload`) => `void`

#### Returns

() => `void`
