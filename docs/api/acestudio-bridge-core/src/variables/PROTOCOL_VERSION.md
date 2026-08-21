# Variable: PROTOCOL\_VERSION

```ts
const PROTOCOL_VERSION: 2 = 2;
```

The bridge protocol version this SDK speaks — the framing and RPC shape,
distinct from the contract surface version the bindings carry. A host
accepting a different major fails the handshake.

## Remarks

Mirrors `kCoreSessionProtocolVersion` on the Studio side — one integer for the
whole core seam, which `WorkflowExtensionHandshake::kProtocolVersion` is an alias
of. The value is a major and any difference is a mismatch: there is no minor for a
host to tolerate, so this must track that constant exactly.
