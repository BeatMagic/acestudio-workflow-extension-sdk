# Type Alias: ManifestClient\<M\>

```ts
type ManifestClient<M> = ScopedBindings<CapabilityTokensOf<M["capabilities"][number]>>;
```

The client a manifest's `capabilities` reach: each domain keeps only the methods
those capabilities can call, a domain none of them reaches is absent entirely,
and ungated operations are there regardless.

A manifest whose `capabilities` are not literal — one typed as
[ExtensionManifest](../interfaces/ExtensionManifest.md) rather than written `as const` — reaches the whole
public surface, because there is nothing left to narrow by.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](../interfaces/ExtensionManifest.md)
