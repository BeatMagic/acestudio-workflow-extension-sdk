# Type Alias: ProfileScopedBindings\<P\>

```ts
type ProfileScopedBindings<P> = ScopedBindings<ProfileTokens<P>>;
```

A client scoped to a profile — what `connection.scoped('surface.…')` returns.

## Type Parameters

### P

`P` *extends* [`ProfileName`](ProfileName.md)
