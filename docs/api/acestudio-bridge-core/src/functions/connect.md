# Function: connect()

```ts
function connect(options): Promise<BridgeConnection>;
```

Open a session against a running ACE Studio: run the canonical handshake
over `transport` and resolve once the host has granted a session.

## Parameters

### options

[`ConnectOptions`](../interfaces/ConnectOptions.md)

## Returns

`Promise`\<[`BridgeConnection`](../interfaces/BridgeConnection.md)\>

## Throws

BridgeError with code `HANDSHAKE_FAILED` if the host refuses,
`SURFACE_VERSION_MISMATCH` if its contract surface is a different major than
these bindings', `BRIDGE_UNREACHABLE` if the transport drops, or `TIMEOUT`
if the handshake outruns its deadline.
