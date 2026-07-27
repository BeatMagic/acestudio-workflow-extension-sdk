# Interface: HandshakeParams

Parameters of `session.handshake`.

## Properties

### authToken

```ts
authToken: string;
```

The one-time session token the host minted for this peer and handed over
out of band — for a spawned child, in its environment. Single-use: one
successful handshake, and a second on the same connection is refused.

***

### protocolVersion

```ts
protocolVersion: number;
```

The bridge protocol version the peer speaks. Each driver numbers its own;
a different major fails the handshake.

***

### requestedCapabilities?

```ts
optional requestedCapabilities?: string[];
```

Capability names the peer asks for — profiles and/or tokens, resolved by
the registry. A host that grants a whole surface ignores them, and the
extension host derives an extension's grant from the consent record
captured at install rather than from anything asked for at runtime.
