# Variable: SURFACE\_VERSION

```ts
const SURFACE_VERSION: "4.0" = '4.0';
```

The contract surface version these bindings were generated from (`major.minor`). The handshake compares it against the host's: a major mismatch is a typed error at connect, minor drift is fine under the tolerant-reader rule.
