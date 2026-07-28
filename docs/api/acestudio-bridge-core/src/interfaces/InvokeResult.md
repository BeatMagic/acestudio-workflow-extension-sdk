# Interface: InvokeResult

Result of `operation.invoke` — the command-result envelope's success half.

The failure half is NOT here: a refused operation answers with a JSON-RPC
error carrying the canonical code in `data.code` (with `data.details` /
`data.hint` beside it), which is how this socket already refuses an
ungranted call. One error path, so a caller reads CAPABILITY_DENIED the same
way whichever gate produced it — the session's, the catalog's, or its own
SDK-side pre-wire guard.

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
