# Interface: OperationDescriptor

What one generated operation is, for the runtime that binds the interfaces below onto a connection.

## Properties

### bulkEncoding?

```ts
readonly optional bulkEncoding?: "base64";
```

The `encoding` argument the runtime pins on this operation, absent when it declares none. The choice is not a caller's: bindings speak typed arrays, and `json` would change the payload shape under the same method.

***

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

### entitlement?

```ts
readonly optional entitlement?: string;
```

The pay gate the account must satisfy, absent when the operation is free.

***

### fingerprintPrecondition

```ts
readonly fingerprintPrecondition: boolean;
```

True when the operation checks a carried fingerprint, and so accepts `ifMatch`. The type above already refuses one elsewhere; the runtime reads this to refuse an untyped caller's too, rather than forward a token the host would accept and ignore.

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

***

### wire

```ts
readonly wire: string;
```

The JSON-RPC method the host serves this operation as (ADR 0127 §1): each segment of `path` becomes a dotted segment, kebab lowered to camel, so path `'auth get-token'` is served as `auth.getToken`. Emitted rather than derived from `domain` and `method`, which coincide with it only while every path is two segments and none is a wildcard route; re-deriving the rule here is how the two ends drift apart. Send this, not `path`.
