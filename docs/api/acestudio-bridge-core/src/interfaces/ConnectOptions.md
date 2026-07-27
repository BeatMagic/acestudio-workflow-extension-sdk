# Interface: ConnectOptions

What [connect](../functions/connect.md) needs to open a session.

## Properties

### authToken

```ts
authToken: string;
```

The session token the host minted for this peer.

***

### clientVersion?

```ts
optional clientVersion?: string;
```

Version of the connecting consumer, for the host's logs.

***

### requestedCapabilities?

```ts
optional requestedCapabilities?: readonly string[];
```

Capability names to request — profiles, tokens, or both; the registry
resolves which. A host that grants a whole surface ignores them.

***

### signal?

```ts
optional signal?: AbortSignal;
```

Abort the handshake.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Deadline for the handshake, in milliseconds.

***

### transport

```ts
transport: Transport;
```

The message port to speak over.
