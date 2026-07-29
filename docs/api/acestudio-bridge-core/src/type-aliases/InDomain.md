# Type Alias: InDomain\<T\>

```ts
type InDomain<T> = Exclude<Reachable<T>, {
  domain: "";
}>;
```

Reachable operations that nest under a domain, and those that do not. Exported
for the same reason as [Camel](Camel.md): [ScopedBindings](ScopedBindings.md) names them, so the
public surface cannot be described without them.

## Type Parameters

### T

`T` *extends* [`CapabilityToken`](CapabilityToken.md)
