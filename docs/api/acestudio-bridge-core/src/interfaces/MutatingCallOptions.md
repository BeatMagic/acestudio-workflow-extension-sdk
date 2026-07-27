# Interface: MutatingCallOptions

Options a mutating call additionally accepts — the remote-edit guardrails. Omitting `waitBusy` is fail-fast: a call landing mid-gesture answers `USER_BUSY` rather than queueing. Omitting `ifMatch` is an unguarded write.

## Extends

- [`CallOptions`](CallOptions.md)

## Properties

### ifMatch?

```ts
optional ifMatch?: Fingerprint;
```

The fingerprint from a prior read; the write fails `STALE_WRITE` if content changed since.

***

### signal?

```ts
optional signal?: AbortSignal;
```

Abort the local wait. The host-side work is unaffected.

#### Inherited from

[`CallOptions`](CallOptions.md).[`signal`](CallOptions.md#signal)

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Local deadline for this call, in milliseconds.

#### Inherited from

[`CallOptions`](CallOptions.md).[`timeoutMs`](CallOptions.md#timeoutms)

***

### waitBusy?

```ts
optional waitBusy?: number;
```

Wait up to this many milliseconds for the user to finish before failing `USER_BUSY`.
