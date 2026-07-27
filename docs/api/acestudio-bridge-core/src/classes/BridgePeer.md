# Class: BridgePeer

A JSON-RPC peer over one transport.

## Constructors

### Constructor

```ts
new BridgePeer(transport): BridgePeer;
```

#### Parameters

##### transport

[`Transport`](../interfaces/Transport.md)

#### Returns

`BridgePeer`

## Accessors

### isClosed

#### Get Signature

```ts
get isClosed(): boolean;
```

Whether the transport has closed.

##### Returns

`boolean`

## Methods

### close()

```ts
close(): void;
```

Close the transport, failing every call still in flight.

#### Returns

`void`

***

### notify()

```ts
notify(method, params?): void;
```

Send a notification — no id, no answer.

#### Parameters

##### method

`string`

##### params?

`unknown`

#### Returns

`void`

***

### onClose()

```ts
onClose(listener): Unsubscribe;
```

Listen for the transport closing.

#### Parameters

##### listener

() => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### request()

```ts
request<T>(
   method, 
   params?, 
options?): Promise<T>;
```

Call a method on the other side.

#### Type Parameters

##### T

`T`

#### Parameters

##### method

`string`

##### params?

`unknown`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

#### Returns

`Promise`\<`T`\>

#### Throws

BridgeError with code `BRIDGE_UNREACHABLE` if the transport drops
first, or `TIMEOUT` if the deadline expires or the signal fires.

***

### setRequestHandler()

```ts
setRequestHandler<P, R>(method, handler): void;
```

Serve a method the other side may call. One handler per method. The name is
the one the generated bindings' peer interface expects.

#### Type Parameters

##### P

`P`

##### R

`R`

#### Parameters

##### method

`string`

##### handler

(`params`) => `R` \| `Promise`\<`R`\>

#### Returns

`void`

***

### subscribe()

```ts
subscribe<T>(method, listener): Unsubscribe;
```

Listen for one notification method.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### method

`string`

##### listener

(`params`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### withDeadline()

```ts
withDeadline<T>(options, call): Promise<T>;
```

Bound a call the generated bindings make. Their peer interface takes no
options — the schema describes the wire, not the caller's patience — so a
deadline wraps the call from outside instead.

#### Type Parameters

##### T

`T`

#### Parameters

##### options

[`RequestOptions`](../interfaces/RequestOptions.md)

##### call

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

#### Throws

BridgeError with code `TIMEOUT` if the deadline expires or the
signal fires. The host-side work is unaffected either way.
