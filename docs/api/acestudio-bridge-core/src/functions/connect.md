# Function: connect()

## Call Signature

```ts
function connect(options): Promise<BridgeConnection<PublicBindings>>;
```

Open a session against a running ACE Studio: run the canonical handshake
over `transport` and resolve once the host has granted a session.

### Parameters

#### options

[`ConnectOptions`](../interfaces/ConnectOptions.md) & \{
  `surface?`: `undefined`;
\}

### Returns

`Promise`\<[`BridgeConnection`](../interfaces/BridgeConnection.md)\<[`PublicBindings`](../interfaces/PublicBindings.md)\>\>

### Throws

BridgeError with code `HANDSHAKE_FAILED` if the host refuses,
`PROTOCOL_VERSION_MISMATCH` on a wire-major skew, `BRIDGE_UNREACHABLE` if the
transport drops, or `TIMEOUT` if the handshake outruns its deadline.

## Call Signature

```ts
function connect<Bindings>(options): Promise<BridgeConnection<Bindings>>;
```

Open a session whose client spans the artifact `surface` describes.

`Bindings` has no default here on purpose. Naming a surface and not naming
what it builds leaves `client` as `unknown`, which is the honest answer and
forces the caller to say which interface they passed the tables for — where a
default would quietly hand back the public one instead.

### Type Parameters

#### Bindings

`Bindings`

### Parameters

#### options

[`ConnectOptions`](../interfaces/ConnectOptions.md) & \{
  `surface`: [`DriverSurface`](../interfaces/DriverSurface.md);
\}

### Returns

`Promise`\<[`BridgeConnection`](../interfaces/BridgeConnection.md)\<`Bindings`\>\>
