# Interface: InvokeResult

Result of `operation.invoke` — the command-result envelope's success half.

The failure half of the envelope is NOT here. A refused operation answers with
a JSON-RPC error instead: the canonical code in `data.code`, the composed
message as the error's own `message`, and `data.details` / `data.hint` when the
refusal carries them. The session gate already refuses this way, so one error
path means a caller reads CAPABILITY_DENIED the same whichever gate produced
it — the session's, the catalog's, or its own SDK-side pre-wire guard.

This is the one place the surface departs from `CommandResult`, whose failures
ride *inside* the result because MCP's tool-call envelope needs them there. A
handler translates: `CommandError` becomes the JSON-RPC error, warnings stay
here.

## Properties

### data

```ts
data: unknown;
```

The operation's success payload, shaped by its declared output schema.

***

### warnings?

```ts
optional warnings?: InvokeWarning[];
```

Advisory warnings raised while the operation ran (ADR 0083 §2).
