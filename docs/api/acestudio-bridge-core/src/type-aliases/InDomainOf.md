# Type Alias: InDomainOf\<Rows, T\>

```ts
type InDomainOf<Rows, T> = Exclude<ReachableIn<Rows, T>, {
  domain: "";
}>;
```

The reachable rows that nest under a domain — the ones that become
`client.clip.list()` rather than a method on the client itself.

## Type Parameters

### Rows

`Rows` *extends* [`SurfaceRow`](../interfaces/SurfaceRow.md)

### T

`T` *extends* `string`
