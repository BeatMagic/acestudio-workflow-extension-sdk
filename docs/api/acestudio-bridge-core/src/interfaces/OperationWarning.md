# Interface: OperationWarning

An advisory fact about an operation that succeeded (ADR 0083 §2) — the wire
warning plus the path that raised it, since a listener sees warnings from every
call and the code alone would not say which one.

It never means the work failed. A refusal is a [BridgeError](../classes/BridgeError.md); this is the
host mentioning something worth knowing on the way past.

The operations that raise warnings declare them on their own result types, so a
caller that wants them typed can read `result.warnings`. This channel exists so
that one that does not care never has to branch to stay correct: the sink sees
every warning from every call, whatever the result shape.

## Properties

### code

```ts
readonly code: string;
```

Stable SCREAMING_SNAKE identifier from the canonical registry.

***

### hint?

```ts
readonly optional hint?: string;
```

Optional recovery advice, composed where the warning was raised.

***

### path

```ts
readonly path: string;
```

The canonical operation path whose call raised it.
