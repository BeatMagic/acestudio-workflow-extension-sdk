# Variable: SURFACE\_VERSION

```ts
const SURFACE_VERSION: "17.2" = '17.2';
```

The contract surface version these bindings were generated from (`feature.revision`). The host stamps its own into the handshake response as `surfaceVersion`, and nothing compares the two — deliberately, because one number cannot say whether a call will work, and a whole-surface gate would refuse a consumer over changes it never touches. The first position moves when a feature lands or something breaks, the second for a fixup; breaks are described in the `changelog` topic. Clearing the protocol handshake does not guarantee that any given method has the shape you expect: no method-level compatibility check exists yet, and building one is open work.
