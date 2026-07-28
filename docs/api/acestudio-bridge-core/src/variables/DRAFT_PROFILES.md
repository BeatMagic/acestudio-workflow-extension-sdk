# Variable: DRAFT\_PROFILES

```ts
const DRAFT_PROFILES: readonly ["surface.extension-sdk.v1"];
```

The profiles above the registry still marks draft (ADR 0093 §6): their expansions are exempt from the freeze snapshot, so one may be re-cut in a later release. Depending on a draft profile by name is allowed and this is how to know you are.
