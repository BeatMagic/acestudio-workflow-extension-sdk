# Interface: ConnectOptions

What (connect:1) needs to open a session.

## Properties

### authToken

```ts
authToken: string;
```

The one-time session token the host minted for this process.

***

### debug?

```ts
optional debug?: boolean;
```

Log what the SDK does — the handshake, every call and how it ended, every
channel event — to stderr. Off by default.

Operations and capabilities by name, never a payload: there is no wire trace
here, on purpose (ADR 0091 §6). An extension does not pass this; the SDK reads
it from the environment variable its dev tooling sets.

***

### onPrepareMove?

```ts
optional onPrepareMove?: () => void | Promise<void>;
```

Quiesce hook for `session.prepareMove` (ADR 0121 §5). The host calls this
*before* it relocates the project folder — a Save-As, or the first save of a
project that until now lived in a temporary one — and blocks the save until it
acks. Stop writing under the project folder and release every handle you hold
there, then resolve: the SDK acks `ready: true`, and the host then takes a
consistent, handle-free copy.

This does not ask you to finish long work. Checkpoint what is in flight and
pick it up on the resume, which is [BridgeConnection.onProjectRelocated](BridgeConnection.md#onprojectrelocated)
— the folder's new path on a committed move, the path you already had on an
abandoned one. Stay parked until it arrives; reopening as soon as this returns
would race the copy the ack just authorized.

If omitted, the SDK still acks `ready: true`, so a peer that advertises
`session.move` without quiescing would let a live writer race the copy —
provide this whenever `session.move` is in the manifest. A peer that does not
hold `session.move` never receives the call, and needs no hook.

#### Returns

`void` \| `Promise`\<`void`\>

***

### requestedCapabilities?

```ts
optional requestedCapabilities?: readonly string[];
```

Capability names to request. The extension host ignores them — an
extension's grant is the consent record from install — so this is for the
drivers that do resolve a request against the registry.

***

### signal?

```ts
optional signal?: AbortSignal;
```

Abort the handshake.

***

### surface?

```ts
optional surface?: DriverSurface;
```

The generated tables this driver carries, bundled. Defaults to
`PUBLIC_SURFACE`, so a consumer of the published operations alone never
sets it.

A driver holding the privileged artifact passes `PRIVILEGED_SURFACE` from
`@beatmagic/bridge-privileged-bindings` and gets those domain groups on its
client beside the published ones (ADR 0094 §2, amended 2026-08-17). The
type is not inferred from the value — name it on the call.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Deadline for the handshake, in milliseconds.

***

### transport

```ts
transport: Transport;
```

The message port to speak over.
