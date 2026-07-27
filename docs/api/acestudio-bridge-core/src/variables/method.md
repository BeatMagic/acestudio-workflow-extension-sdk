# Variable: method

```ts
const method: {
  hello: "bridge.hello";
  invokeCommand: "bridge.invokeCommand";
  ping: "bridge.ping";
};
```

Wire method names. The `bridge.` prefix is the driver's; the payloads are
the canonical ones.

## Type Declaration

### hello

```ts
readonly hello: "bridge.hello" = "bridge.hello";
```

Opens the session and carries the canonical handshake payload.

### invokeCommand

```ts
readonly invokeCommand: "bridge.invokeCommand" = "bridge.invokeCommand";
```

Invokes one catalog operation by canonical path.

### ping

```ts
readonly ping: "bridge.ping" = "bridge.ping";
```

Liveness echo, served by the SDK on the host's behalf.
