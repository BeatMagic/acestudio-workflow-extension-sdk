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

The version of this handshake's wire contract that the peer speaks.

One number for the seam rather than one per driver: the MV runtime host
and the extension host serve the same core methods to the same client
library, and that library announces a single version to whichever socket
it opens, so two numbers would leave it able to satisfy only one of them.
Any difference fails the handshake — the value is the major, and there is
no minor to tolerate.

***

### requestedCapabilities?

```ts
optional requestedCapabilities?: string[];
```

Capability names the peer asks for — profiles and/or tokens. What is
actually granted is the host's decision, and may be narrower or wider than
what was asked for: read `grantedTokens` from the result, never this list.
