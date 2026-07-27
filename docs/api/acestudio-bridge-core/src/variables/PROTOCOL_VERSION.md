# Variable: PROTOCOL\_VERSION

```ts
const PROTOCOL_VERSION: 1 = 1;
```

The bridge protocol version this SDK speaks — the framing and RPC shape,
distinct from the contract surface version the bindings carry. A host
accepting a different major fails the handshake.

## Remarks

Mirrors `WorkflowExtensionHandshake::kProtocolVersion` on the Studio side.
