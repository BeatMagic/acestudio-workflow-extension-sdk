# Type Alias: AtRoot\<T\>

```ts
type AtRoot<T> = Extract<Reachable<T>, {
  domain: "";
}>;
```

The other half of [InDomain](InDomain.md): reachable operations declared with no domain,
which land on the client itself rather than under a group.

Every operation in the current catalogue has a domain, so this resolves to `never`
and contributes nothing to a scoped client today. It is the half of the split that
keeps [ScopedBindings](ScopedBindings.md) correct if a domain-less operation is ever published,
instead of quietly dropping it.

## Type Parameters

### T

`T` *extends* [`CapabilityToken`](CapabilityToken.md)
