# Function: connect()

```ts
function connect<Bindings>(options): Promise<BridgeConnection<Bindings>>;
```

Open a session against a running ACE Studio: run the canonical handshake
over `transport` and resolve once the host has granted a session.

## Type Parameters

### Bindings

`Bindings` = [`PublicBindings`](../interfaces/PublicBindings.md)

## Parameters

### options

[`ConnectOptions`](../interfaces/ConnectOptions.md)

## Returns

`Promise`\<[`BridgeConnection`](../interfaces/BridgeConnection.md)\<`Bindings`\>\>

## Throws

BridgeError with code `HANDSHAKE_FAILED` if the host refuses,
`PROTOCOL_VERSION_MISMATCH` on a wire-major skew, `BRIDGE_UNREACHABLE` if the
transport drops, or `TIMEOUT` if the handshake outruns its deadline.
