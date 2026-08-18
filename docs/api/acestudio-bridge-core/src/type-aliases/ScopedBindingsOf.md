# Type Alias: ScopedBindingsOf\<Rows, B, T\>

```ts
type ScopedBindingsOf<Rows, B, T> = { readonly [D in InDomainOf<Rows, T>["domain"] as Camel<D>]: Camel<D> extends keyof B ? Pick<B[Camel<D>], Extract<InDomainOf<Rows, T>, { domain: D }>["method"] & keyof B[Camel<D>]> : never } & Pick<B, AtRootOf<Rows, T>["method"] & keyof B>;
```

What the bindings `B` admit for the tokens `T`, given the rows `Rows` that
describe them: each domain keeps only the members those tokens reach, and a domain
no token reaches is absent entirely.

Takes its rows and bindings as parameters rather than reading this artifact's,
because a profile's reach is not confined to one artifact or to one kind of row:
one profile's tokens can gate operations published here, operations a first-party
artifact declares, and the change channels of either. A facade able to see only
some of those reports the rest as ungranted. Pass every table whose rows the
profile can reach — `Rows` and `B` must describe the same surface, and a table
paired with bindings it does not build leaves every domain `never`.

## Type Parameters

### Rows

`Rows` *extends* [`SurfaceRow`](../interfaces/SurfaceRow.md)

### B

`B`

### T

`T` *extends* `string`
