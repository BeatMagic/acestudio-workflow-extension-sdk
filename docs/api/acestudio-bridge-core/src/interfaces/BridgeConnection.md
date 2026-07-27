# Interface: BridgeConnection

An open, granted session against a running ACE Studio.

## Properties

### grantedTokens

```ts
readonly grantedTokens: readonly string[];
```

The session's grant, as flat canonical token names.

***

### peer

```ts
readonly peer: BridgePeer;
```

The JSON-RPC peer underneath: the generated bindings ride it, and it is how
to call or subscribe to anything they do not cover.

***

### protocolVersion

```ts
readonly protocolVersion: number;
```

The bridge protocol version the host accepted. Informational: it matched
ours or [connect](../functions/connect.md) would have refused the session.

***

### sessionId

```ts
readonly sessionId: string;
```

The session id the host minted.

## Methods

### close()

```ts
close(): void;
```

Close the connection, failing every call in flight.

#### Returns

`void`

***

### onClose()

```ts
onClose(listener): Unsubscribe;
```

Listen for the connection dropping.

#### Parameters

##### listener

() => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onShutdown()

```ts
onShutdown(listener): Unsubscribe;
```

Called when the host announces it is stopping this peer, ahead of its
grace window. Running `deactivate` and exiting in time is the extension
layer's job; core only surfaces the notice.

#### Parameters

##### listener

(`params`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)
