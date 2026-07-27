# Interface: ShutdownParams

Payload of `session.shutdown`.

## Properties

### graceMs

```ts
graceMs: number;
```

How long the peer has to wind down before the host kills it.

***

### reason

```ts
reason: string;
```

Why the host is stopping this peer.
