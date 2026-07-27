# Interface: BridgeConnection

An open, granted session against a running ACE Studio.

## Properties

### appVersion

```ts
readonly appVersion: string;
```

The version of ACE Studio on the other end.

***

### grantedTokens

```ts
readonly grantedTokens: readonly string[];
```

The session's grant, as flat canonical token names.

***

### peer

```ts
readonly peer: BridgePeer;
```

The JSON-RPC peer underneath. The generated bindings ride it, and it stays
the escape hatch for a call the bindings do not cover.

***

### protocolVersion

```ts
readonly protocolVersion: number;
```

The bridge protocol version the host accepted. Informational: ACE Studio
does not gate the session on it, so neither does this SDK.

***

### sessionId

```ts
readonly sessionId: string;
```

The session id the host minted.

***

### surfaceVersion

```ts
readonly surfaceVersion: string;
```

The host's contract surface version, or `""` if it reported none.

## Methods

### close()

```ts
close(): void;
```

Close the connection, failing every call in flight.

#### Returns

`void`

***

### invoke()

```ts
invoke<T>(
   path, 
   args?, 
options?): Promise<T>;
```

Invoke one catalog operation by canonical path, unwrapping the
command-result envelope down to its `data`. Call `bridge.invokeCommand`
through [BridgeConnection.peer](#peer) instead to read the whole envelope,
warnings included.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### path

`string`

##### args?

`Record`\<`string`, `unknown`\>

##### options?

[`InvokeOptions`](InvokeOptions.md)

#### Returns

`Promise`\<`T`\>

#### Throws

BridgeError carrying the host's code when the operation is refused.

***

### onClose()

```ts
onClose(listener): Unsubscribe;
```

Listen for the connection dropping.

#### Parameters

##### listener

() => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)
