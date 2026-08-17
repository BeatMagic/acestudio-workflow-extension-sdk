# Interface: BridgeConnection\<Bindings\>

An open, granted session against a running ACE Studio.

## Type Parameters

### Bindings

`Bindings` = [`PublicBindings`](PublicBindings.md)

## Properties

### client

```ts
readonly client: Bindings;
```

The typed operation surface: `client.track.list()`, `client.clip.create()` —
the canonical operation tree, one method per operation. A call the grant
cannot reach is refused here rather than on the wire.

`PublicBindings` unless [ConnectOptions.surface](ConnectOptions.md#surface) carried another
artifact, in which case name the union at the call:

```ts
const connection = await connect<PublicBindings & PrivilegedBindings>({
  transport, authToken, surface: PRIVILEGED_SURFACE,
});
```

***

### grant

```ts
readonly grant: Grant;
```

What this session may reach, settled at the handshake. Read `grant.tokens`
to branch on it, `grant.missing(...)` to find out what a partial grant is
short of, and `grant.provenance.granted` for the host's answer verbatim.

***

### peer

```ts
readonly peer: BridgePeer;
```

The JSON-RPC peer underneath: the generated bindings ride it, and it is how
to call or subscribe to anything they do not cover.

***

### protocolVersion

```ts
readonly protocolVersion: number;
```

The bridge protocol version the host accepted. Informational: it matched
ours or [connect](../functions/connect.md) would have refused the session.

***

### sessionId

```ts
readonly sessionId: string;
```

The session id the host minted.

## Methods

### close()

```ts
close(): void;
```

Close the connection, failing every call in flight.

#### Returns

`void`

***

### job()

```ts
job<Result>(id): JobHandle<Result>;
```

A [JobHandle](JobHandle.md) on a job in the ledger, by id — including one this
session did not start, since job visibility is project-session-wide with
attribution (ADR 0084). A job-class operation hands back its own handle; this
is how to get one for a job whose id arrived some other way.

Nothing is checked here: an id that names no job fails on the first call the
handle makes, as the same id passed to `client.job.get` would.

#### Type Parameters

##### Result

`Result` = `unknown`

#### Parameters

##### id

`string`

#### Returns

[`JobHandle`](JobHandle.md)\<`Result`\>

***

### onClose()

```ts
onClose(listener): Unsubscribe;
```

Listen for the connection dropping.

#### Parameters

##### listener

() => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onProjectRelocated()

```ts
onProjectRelocated(listener): Unsubscribe;
```

Called when the host has finished relocating the project folder, which
releases a peer parked by [ConnectOptions.onPrepareMove](ConnectOptions.md#onpreparemove). `projectFolder`
is the destination on a committed move, and the path the peer already had on an
abandoned one — so an unchanged value is the host saying "carry on where you
are". Reopen what the quiesce released, under whichever path arrives.

This is the only end of the quiesce. There is no separate "the move failed"
notice, because a peer parked forever is the failure mode that matters and one
announcement covers both endings.

#### Parameters

##### listener

(`params`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onShutdown()

```ts
onShutdown(listener): Unsubscribe;
```

Called when the host announces it is stopping this peer, ahead of its
grace window. Running `deactivate` and exiting in time is the extension
layer's job; core only surfaces the notice.

#### Parameters

##### listener

(`params`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onWarning()

```ts
onWarning(listener): Unsubscribe;
```

Called for each advisory warning an operation comes back with (ADR 0083 §2),
from any call on this connection. A warning never means the call failed — a
refusal is a thrown [BridgeError](../classes/BridgeError.md) — so this is a separate channel
rather than something folded into a return value.

With no listener registered, warnings go to `console.warn` instead: Studio
captures the extension's stdio (ADR 0091 §5), so an unobserved advisory is
still recoverable from the log rather than dropped. Registering a listener
takes that over completely.

#### Parameters

##### listener

(`warning`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### require()

```ts
require(...tokens): void;
```

Assert this session reaches every one of `tokens`, so a consumer that
cannot work without them fails at startup instead of part-way through.

#### Parameters

##### tokens

...[`CapabilityToken`](../type-aliases/CapabilityToken.md)[]

#### Returns

`void`

#### Throws

BridgeError with code `CAPABILITY_DENIED`, naming every missing
token — not just the first one found.

***

### scoped()

#### Call Signature

```ts
scoped<P>(profile): ProfileScopedBindings<P>;
```

The same client, typed down to what a profile — or an explicit set of
tokens — can reach. A compile-time view and nothing more: the object handed
back is [BridgeConnection.client](#client) itself, so scoping costs no runtime
machinery and cannot disagree with the guard that does the refusing.

Nothing is checked at run time, here or by the returned client: an unknown
profile name reaching this from untyped JavaScript yields the whole client
rather than an error. Scoping is a view of *reach*, not a grant — the guard
reads the grant, so a call outside the session's grant is still refused.

Extensions rarely call this. Their manifest is the requested set, so the
extension layer hands them a client already typed to it.

##### Type Parameters

###### P

`P` *extends* 
  \| `"surface.cli-mcp"`
  \| `"surface.extension-sdk"`
  \| `"transport.v1"`
  \| `"ui.v1"`
  \| `"timeline.tempo.v1"`
  \| `"generative.all.v1"`

##### Parameters

###### profile

`P`

##### Returns

[`ProfileScopedBindings`](../type-aliases/ProfileScopedBindings.md)\<`P`\>

#### Call Signature

```ts
scoped<T>(...tokens): ScopedBindings<T>;
```

##### Type Parameters

###### T

`T` *extends* [`CapabilityToken`](../type-aliases/CapabilityToken.md)

##### Parameters

###### tokens

...`T`[]

##### Returns

[`ScopedBindings`](../type-aliases/ScopedBindings.md)\<`T`\>
