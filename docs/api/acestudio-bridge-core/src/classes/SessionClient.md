# Class: SessionClient

## Constructors

### Constructor

```ts
new SessionClient(peer): SessionClient;
```

#### Parameters

##### peer

[`SessionPeer`](../interfaces/SessionPeer.md)

#### Returns

`SessionClient`

## Methods

### onSessionShutdown()

```ts
onSessionShutdown(callback): Unsubscribe;
```

Host-emitted: step one of the notify -\> grace -\> hard-kill routine. The SDK
runs the peer's `deactivate` and exits within `graceMs`.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### sessionHandshake()

```ts
sessionHandshake(params): Promise<HandshakeResult>;
```

Host-served: the peer calls this immediately after connecting, to
authenticate with its one-time token and receive its Grant.

#### Parameters

##### params

[`HandshakeParams`](../interfaces/HandshakeParams.md)

#### Returns

`Promise`\<[`HandshakeResult`](../interfaces/HandshakeResult.md)\>

***

### setSessionPrepareMoveHandler()

```ts
setSessionPrepareMoveHandler(handler): void;
```

Peer-served: the host calls this before relocating the session folder — a
Save-As, or the first save of a project that until now lived in a temporary
one — and blocks on the ack, so what it copies is a consistent, handle-free
snapshot rather than one racing a live writer.

Quiesce at the next boundary you control. This asks you to stop writing, not
to finish long work: checkpoint what is in flight and resume it afterwards.
How you learn the relocation finished, and where the folder went, is your
driver's own signal — this verb covers only the quiesce.

Distinct from `session.shutdown`: the process stays alive and in-memory state
survives. Not `\@sdkManaged`, because only the peer knows what it holds open —
the SDK hands this one to you as a handler. A peer that does not advertise
`session.move` never receives the call, and the host degrades to relocating
without the quiesce.

#### Parameters

##### handler

() => 
  \| [`PrepareMoveResult`](../interfaces/PrepareMoveResult.md)
  \| `Promise`\<[`PrepareMoveResult`](../interfaces/PrepareMoveResult.md)\>

#### Returns

`void`
