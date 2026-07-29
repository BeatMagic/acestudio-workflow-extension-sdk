# Type Alias: InDomain\<T\>

```ts
type InDomain<T> = Exclude<Reachable<T>, {
  domain: "";
}>;
```

The reachable operations that nest under a domain — the ones that become
`client.clip.list()` rather than a method on the client itself.

Exported for the same reason as [Camel](Camel.md): [ScopedBindings](ScopedBindings.md) names it, so
the public surface cannot be described without it.

## Type Parameters

### T

`T` *extends* [`CapabilityToken`](CapabilityToken.md)
