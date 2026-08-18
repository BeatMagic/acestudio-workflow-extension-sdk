# Type Alias: ScopedBindings\<T\>

```ts
type ScopedBindings<T> = ScopedBindingsOf<Descriptor, PublicBindings, T>;
```

The client `T`'s reach admits over this artifact's published surface — what
`connection.scoped(...)` returns here.

## Type Parameters

### T

`T` *extends* [`CapabilityToken`](CapabilityToken.md)
