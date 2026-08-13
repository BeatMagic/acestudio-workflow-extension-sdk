# Type Alias: SessionCapability

```ts
type SessionCapability = 
  | "session.handshake"
  | "session.move"
  | "session.ping"
  | "session.shutdown";
```

A capability token declared in the IDL. Each method/notification is gated by exactly one (ADR 0015).
