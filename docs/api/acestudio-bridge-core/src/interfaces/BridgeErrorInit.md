# Interface: BridgeErrorInit\<C\>

Everything a [BridgeError](../classes/BridgeError.md) carries beyond its message.

## Type Parameters

### C

`C` *extends* [`AnyBridgeErrorCode`](../type-aliases/AnyBridgeErrorCode.md) = [`AnyBridgeErrorCode`](../type-aliases/AnyBridgeErrorCode.md)

## Properties

### cause?

```ts
optional cause?: unknown;
```

The lower-level failure this one wraps.

***

### code

```ts
code: C;
```

***

### details?

```ts
optional details?: DetailsFor<C>;
```

Structured context for the code.

***

### hint?

```ts
optional hint?: string;
```

Recovery advice, composed where the refusal happened.

***

### message

```ts
message: string;
```
