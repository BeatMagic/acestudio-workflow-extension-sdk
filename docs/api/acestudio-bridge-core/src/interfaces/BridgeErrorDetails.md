# Interface: BridgeErrorDetails

What `details` holds for the codes that promise a shape. Any other code
narrows to a plain object — a code gains an entry here when its details
become a contract.

## Properties

### CAPABILITY\_DENIED

```ts
CAPABILITY_DENIED: {
  missing: readonly string[];
  token?: string;
};
```

#### missing

```ts
missing: readonly string[];
```

The tokens the session's grant is short of. Always populated — a refused
call names the one token it needed, and `connection.require()` names every
token it asked for and did not get.

#### token?

```ts
optional token?: string;
```

The single token a refused operation required, as the host spells it in
`details.token`. Absent when the refusal was not about one operation.

***

### PROTOCOL\_VERSION\_MISMATCH

```ts
PROTOCOL_VERSION_MISMATCH: {
  actual: number;
  expected: number;
};
```

#### actual

```ts
actual: number;
```

The version the host said it accepted.

#### expected

```ts
expected: number;
```

The bridge protocol version this SDK speaks.

***

### SURFACE\_VERSION\_MISMATCH

```ts
SURFACE_VERSION_MISMATCH: {
  actual: string;
  expected: string;
};
```

#### actual

```ts
actual: string;
```

The surface version the host reported.

#### expected

```ts
expected: string;
```

The surface version the bindings were generated from.
