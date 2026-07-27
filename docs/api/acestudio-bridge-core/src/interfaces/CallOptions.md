# Interface: CallOptions

Options every call accepts. `signal` aborts the local wait only — cancelling work that already reached the host is the job ledger's business.

## Extended by

- [`MutatingCallOptions`](MutatingCallOptions.md)

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

Local deadline for this call, in milliseconds.
