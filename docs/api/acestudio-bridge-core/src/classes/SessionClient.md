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
