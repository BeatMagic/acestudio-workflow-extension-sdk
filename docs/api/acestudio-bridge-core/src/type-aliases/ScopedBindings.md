# Type Alias: ScopedBindings\<T\>

```ts
type ScopedBindings<T> = { readonly [D in InDomain<T>["domain"] as Camel<D>]: Camel<D> extends keyof PublicBindings ? Pick<PublicBindings[Camel<D>], Extract<InDomain<T>, { domain: D }>["method"] & keyof PublicBindings[Camel<D>]> : never } & Pick<PublicBindings, AtRoot<T>["method"] & keyof PublicBindings>;
```

The client `T`'s reach admits: each domain keeps only the methods those tokens
can call, and a domain no token reaches is absent entirely.

## Type Parameters

### T

`T` *extends* [`CapabilityToken`](CapabilityToken.md)
