# Interface: BridgeErrorDetails

What `details` holds for the codes that promise a shape. Any other code
narrows to a plain object — a code gains an entry here when its details
become a contract.

## Properties

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
