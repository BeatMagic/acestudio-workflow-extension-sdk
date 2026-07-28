# Variable: FIELD\_CAPABILITIES

```ts
const FIELD_CAPABILITIES: {
};
```

Capability-gated arguments fields (ADR 0071): setting one on a session that did not negotiate its capability is refused before the wire. A field gated by a capability this artifact may not name is absent from the type above entirely, so it can never appear here.
