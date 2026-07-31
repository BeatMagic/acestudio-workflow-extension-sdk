# Type Alias: RequestedCapability

```ts
type RequestedCapability = 
  | CapabilityToken
  | ProfileName;
```

What an extension may ask for: an atomic capability token, or a published
Capability Profile that stands for a bundle of them.

The request is what the user consents to at install, and the resulting grant is
fixed there — so this list is also the extension's whole reach for as long as
it stays installed at this version.
