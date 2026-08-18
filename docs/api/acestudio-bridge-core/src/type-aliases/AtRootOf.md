# Type Alias: AtRootOf\<Rows, T\>

```ts
type AtRootOf<Rows, T> = Extract<ReachableIn<Rows, T>, {
  domain: "";
}>;
```

The other half of [InDomainOf](InDomainOf.md): reachable rows declared with no domain,
which land on the client itself rather than under a group.

Every operation in the current catalogue has a domain, so this resolves to `never`
and contributes nothing to a scoped client today. It is the half of the split that
keeps [ScopedBindingsOf](ScopedBindingsOf.md) correct if a domain-less operation is ever
published, instead of quietly dropping it.

## Type Parameters

### Rows

`Rows` *extends* [`OperationDescriptor`](../interfaces/OperationDescriptor.md)

### T

`T` *extends* `string`
