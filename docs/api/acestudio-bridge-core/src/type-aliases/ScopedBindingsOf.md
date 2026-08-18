# Type Alias: ScopedBindingsOf\<Rows, B, T\>

```ts
type ScopedBindingsOf<Rows, B, T> = { readonly [D in InDomainOf<Rows, T>["domain"] as Camel<D>]: Camel<D> extends keyof B ? Pick<B[Camel<D>], Extract<InDomainOf<Rows, T>, { domain: D }>["method"] & keyof B[Camel<D>]> : never } & Pick<B, AtRootOf<Rows, T>["method"] & keyof B>;
```

What the bindings `B` admit for the tokens `T`, given the table `Rows` that
describes them: each domain keeps only the methods those tokens can call, and a
domain no token reaches is absent entirely.

Takes its table and bindings as parameters rather than reading this artifact's,
because a profile's reach is not confined to one artifact: one profile's tokens
can gate operations published here and operations a first-party artifact
declares, and a facade able to see only one of them would report the other half
as ungranted. `Rows` and `B` must describe the same surface — pass a table with
bindings it does not build and every domain resolves to `never`.

## Type Parameters

### Rows

`Rows` *extends* [`OperationDescriptor`](../interfaces/OperationDescriptor.md)

### B

`B`

### T

`T` *extends* `string`
