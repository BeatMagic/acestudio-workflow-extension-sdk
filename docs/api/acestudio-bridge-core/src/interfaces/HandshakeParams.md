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

Capability names the peer asks for — profiles and/or tokens. What is
actually granted is the host's decision, and may be narrower or wider than
what was asked for: read `grantedTokens` from the result, never this list.
