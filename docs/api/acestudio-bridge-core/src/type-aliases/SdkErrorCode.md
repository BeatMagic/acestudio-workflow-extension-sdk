# Type Alias: SdkErrorCode

```ts
type SdkErrorCode = 
  | "BRIDGE_UNREACHABLE"
  | "HANDSHAKE_FAILED"
  | "MALFORMED_PAYLOAD"
  | "PROTOCOL_VERSION_MISMATCH"
  | "SURFACE_VERSION_MISMATCH"
  | "TIMEOUT";
```

Codes the SDK raises on its own, without a host answer to quote. They are
canonical-style and reserved for the SDK; `BRIDGE_UNREACHABLE` and `TIMEOUT`
are also canonical host codes, and mean the same thing from either side.
