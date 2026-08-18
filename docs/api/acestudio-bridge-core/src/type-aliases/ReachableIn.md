# Type Alias: ReachableIn\<Rows, T\>

```ts
type ReachableIn<Rows, T> = Extract<Rows, 
  | {
  ungated: true;
}
  | {
  capability: T;
}>;
```

The rows of `Rows` a session holding `T` can reach: everything it has the token
for, plus every ungated operation — a registry-declared pure function is
reachable by any session, including one granted nothing at all.

## Type Parameters

### Rows

`Rows` *extends* [`OperationDescriptor`](../interfaces/OperationDescriptor.md)

### T

`T` *extends* `string`
