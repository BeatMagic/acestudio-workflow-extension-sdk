# Function: createDebugLog()

```ts
function createDebugLog(enabled): DebugLog;
```

A debug log, or a log that discards, depending on whether debug mode is on.

Explicit boolean rather than an environment read: core has no idea what spawned
it, so the layer that does — the extension SDK, reading the variable the dev
tooling sets — is the one that decides.

## Parameters

### enabled

`boolean`

## Returns

[`DebugLog`](../type-aliases/DebugLog.md)
