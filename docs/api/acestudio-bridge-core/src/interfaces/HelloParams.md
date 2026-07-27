# Interface: HelloParams

The handshake request. `token` is the session-token primitive the host
minted for this peer; `requestedCapabilities` names profiles and/or tokens
and the registry resolves which — a host granting a full surface ignores it,
so it rides along as provenance either way.

## Properties

### pid

```ts
pid: number;
```

Process id of the consumer, for the host's logs.

***

### protocolVersion

```ts
protocolVersion: number;
```

***

### requestedCapabilities?

```ts
optional requestedCapabilities?: readonly string[];
```

***

### sdkVersion

```ts
sdkVersion: string;
```

Version of the consumer opening the session, for the host's logs.

***

### token

```ts
token: string;
```
