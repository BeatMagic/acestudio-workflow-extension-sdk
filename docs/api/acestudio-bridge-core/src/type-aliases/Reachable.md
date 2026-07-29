# Type Alias: Reachable\<T\>

```ts
type Reachable<T> = Extract<Descriptor, 
  | {
  ungated: true;
}
  | {
  capability: T;
}>;
```

The operations a session holding `T` can reach: everything it has the token
for, plus every ungated operation — a registry-declared pure function is
reachable by any session, including one granted nothing at all.

## Type Parameters

### T

`T` *extends* [`CapabilityToken`](CapabilityToken.md)
