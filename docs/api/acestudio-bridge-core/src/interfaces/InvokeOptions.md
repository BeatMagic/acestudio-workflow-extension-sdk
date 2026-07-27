# Interface: InvokeOptions

Options for a raw [BridgeConnection.invoke](BridgeConnection.md#invoke) call.

## Properties

### signal?

```ts
optional signal?: AbortSignal;
```

Abort the local wait. The host-side work is unaffected.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Local deadline in milliseconds. The host-side work is unaffected.

***

### waitBusy?

```ts
optional waitBusy?: number;
```

Wait up to this many milliseconds for the user to finish an edit gesture
before failing `USER_BUSY`. Omitting it fails fast.
