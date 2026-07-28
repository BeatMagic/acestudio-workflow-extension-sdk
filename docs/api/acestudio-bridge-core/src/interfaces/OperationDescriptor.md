# Interface: OperationDescriptor

What one generated operation is, for the runtime that binds the interfaces below onto a connection.

## Properties

### capability

```ts
readonly capability: string;
```

The capability gating it, or the operation's own name when ungated.

***

### domain

```ts
readonly domain: string;
```

Domain group the binding nests under; empty for a root-level operation.

***

### method

```ts
readonly method: string;
```

Binding method name — the camelCased verb.

***

### mutating

```ts
readonly mutating: boolean;
```

True when the operation accepts the mutating guardrail options.

***

### path

```ts
readonly path: string;
```

Canonical path, exactly as the operation tree spells it.

***

### takesParams

```ts
readonly takesParams: boolean;
```

True when the binding takes a params object. An operation with no arguments is emitted as `method(options?)` instead, so a runtime binding these methods by position has to read this or it will send the caller's options as the payload.

***

### ungated

```ts
readonly ungated: boolean;
```

True for a registry-declared pure function: no token, no pre-wire check.
