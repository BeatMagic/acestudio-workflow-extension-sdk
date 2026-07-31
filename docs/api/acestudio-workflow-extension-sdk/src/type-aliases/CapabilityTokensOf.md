# Type Alias: CapabilityTokensOf\<C\>

```ts
type CapabilityTokensOf<C> = C extends ProfileName ? ProfileTokens<C> : C extends CapabilityToken ? C : never;
```

The tokens one requested name stands for: a profile expands to its bundle, a
token stands for itself.

## Type Parameters

### C

`C` *extends* [`RequestedCapability`](RequestedCapability.md)
