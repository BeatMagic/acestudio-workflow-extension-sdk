# Interface: HandshakeResult

Result of `session.handshake` — the host's side of the negotiation.

## Properties

### acceptedProtocolVersion

```ts
acceptedProtocolVersion: number;
```

The protocol version the host accepted (both sides exchange it).

***

### grantedTokens

```ts
grantedTokens: string[];
```

The session's Grant as flat, canonical, sorted token names.

***

### sessionId

```ts
sessionId: string;
```

The per-session id the host minted.
