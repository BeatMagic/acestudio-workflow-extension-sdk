# Type Alias: RequestedCapability

```ts
type RequestedCapability = CapabilityToken;
```

What an extension may ask for: an atomic capability token.

The request is what the user consents to at install, and the resulting grant is
fixed there — so this list is also the extension's whole reach for as long as
it stays installed at this version.

A Surface Profile is deliberately **not** one of these. A `surface.*` name is
the ceiling Studio grants a whole consumer class within — it computes
`requested ∩ ceiling` — so nothing requests one, and the host refuses a
manifest that names one at parse rather than resolving it to nothing. The
generated `PROFILES` table holds those ceilings, which is why `ProfileName` is
not part of this union: it is the type you measure a grant *against*
(`grant.missing`, `connection.scoped`), not one you ask with.
