# Class: LocalSocketTransport

A [Transport](../interfaces/Transport.md) over a connected stream socket.

## Implements

- [`Transport`](../interfaces/Transport.md)

## Methods

### close()

```ts
close(): void;
```

Close the transport. Both ends observe the close.

#### Returns

`void`

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`close`](../interfaces/Transport.md#close)

***

### onClose()

```ts
onClose(handler): void;
```

Install the handler invoked once when the transport closes.

#### Parameters

##### handler

() => `void`

#### Returns

`void`

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`onClose`](../interfaces/Transport.md#onclose)

***

### onMessage()

```ts
onMessage(handler): void;
```

Install the handler invoked with each complete inbound message.

#### Parameters

##### handler

(`message`) => `void`

#### Returns

`void`

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`onMessage`](../interfaces/Transport.md#onmessage)

***

### send()

```ts
send(message): void;
```

Send one complete message.

#### Parameters

##### message

`string`

#### Returns

`void`

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`send`](../interfaces/Transport.md#send)

***

### connect()

```ts
static connect(socketPath): Promise<LocalSocketTransport>;
```

Dial the bridge server listening on `socketPath`.

#### Parameters

##### socketPath

`string`

#### Returns

`Promise`\<`LocalSocketTransport`\>

#### Throws

BridgeError with code `BRIDGE_UNREACHABLE` when the socket cannot
be reached.
