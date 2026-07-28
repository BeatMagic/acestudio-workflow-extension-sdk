# Interface: OperationWarning

An advisory fact about an operation that succeeded (ADR 0083 §2) — the wire
warning plus the path that raised it, since a listener sees warnings from every
call and the code alone would not say which one.

It never means the work failed. A refusal is a [BridgeError](../classes/BridgeError.md); this is the
host mentioning something worth knowing on the way past.

## Extends

- [`InvokeWarning`](InvokeWarning.md)

## Properties

### code

```ts
code: string;
```

Stable SCREAMING_SNAKE identifier from the canonical registry.

#### Inherited from

[`InvokeWarning`](InvokeWarning.md).[`code`](InvokeWarning.md#code)

***

### hint?

```ts
optional hint?: string;
```

Optional recovery advice, composed where the warning was raised.

#### Inherited from

[`InvokeWarning`](InvokeWarning.md).[`hint`](InvokeWarning.md#hint)

***

### path

```ts
readonly path: string;
```

The canonical operation path whose call raised it.
