# Interface: ConnectOptions

What [connect](../functions/connect.md) needs to open a session.

## Properties

### authToken

```ts
authToken: string;
```

The one-time session token the host minted for this process.

***

### debug?

```ts
optional debug?: boolean;
```

Log what the SDK does — the handshake, every call and how it ended, every
channel event — to stderr. Off by default.

Operations and capabilities by name, never a payload: there is no wire trace
here, on purpose (ADR 0091 §6). An extension does not pass this; the SDK reads
it from the environment variable its dev tooling sets.

***

### requestedCapabilities?

```ts
optional requestedCapabilities?: readonly string[];
```

Capability names to request. The extension host ignores them — an
extension's grant is the consent record from install — so this is for the
drivers that do resolve a request against the registry.

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
