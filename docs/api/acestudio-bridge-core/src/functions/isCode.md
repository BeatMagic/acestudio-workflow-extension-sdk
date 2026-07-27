# Function: isCode()

```ts
function isCode<C>(value, code): value is BridgeError<C>;
```

Whether a caught value is a [BridgeError](../classes/BridgeError.md) with a particular code,
narrowing `details` to that code's shape.

## Type Parameters

### C

`C` *extends* [`AnyBridgeErrorCode`](../type-aliases/AnyBridgeErrorCode.md)

## Parameters

### value

`unknown`

### code

`C`

## Returns

`value is BridgeError<C>`
