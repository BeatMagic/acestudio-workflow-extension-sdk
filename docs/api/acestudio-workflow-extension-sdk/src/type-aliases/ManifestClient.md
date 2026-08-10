# Type Alias: ManifestClient\<M\>

```ts
type ManifestClient<M> = ScopedBindings<M["capabilities"][number]>;
```

The client a manifest's `capabilities` reach: each domain keeps only the methods
those capabilities can call, a domain none of them reaches is absent entirely,
and ungated operations are there regardless.

The manifest's list scopes this directly, with no expansion step in between: a
`RequestedCapability` is an atomic token, and the one name that used to stand
for a bundle here — a `surface.*` ceiling — is not something a manifest may
request at all.

A manifest whose `capabilities` are not literal — one typed as
[ExtensionManifest](../interfaces/ExtensionManifest.md) rather than written `as const` — reaches the whole
public surface, because there is nothing left to narrow by.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](../interfaces/ExtensionManifest.md)
