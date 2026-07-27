# Variable: REQUIRED\_TOKENS

```ts
const REQUIRED_TOKENS: Readonly<Record<string, CapabilityToken>>;
```

The token each operation requires, for the pre-wire guard: a call the session's grant cannot reach fails locally with the identical typed `CAPABILITY_DENIED` the host would have returned. Ungated operations are absent — they need no token.
