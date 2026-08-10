# Type Alias: ProfileName

```ts
type ProfileName = keyof typeof PROFILES;
```

A published Surface Profile's name — a named bundle of tokens a grant can be
measured against, rather than a list every consumer restates.

Measured against, not asked for. Each of these is a *ceiling*: the most a whole
consumer class may ever be granted, which Studio intersects a request with. So
one of these names is what `missing`/`scoped` take, and is deliberately not
something a manifest may request.
