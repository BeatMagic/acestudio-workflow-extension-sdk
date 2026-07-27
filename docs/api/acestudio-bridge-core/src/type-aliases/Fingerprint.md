# Type Alias: Fingerprint

```ts
type Fingerprint = string & {
  __fingerprint: unique symbol;
};
```

An opaque content fingerprint, obtainable only from a typed read result and passed back as `ifMatch` to guard a write against a stale read. The brand keeps it un-forgeable: no string literal is assignable to it.

## Type Declaration

### \_\_fingerprint

```ts
readonly __fingerprint: unique symbol;
```
