# Interface: MutatingCallOptions

Options a mutating call additionally accepts — the busy-gate guardrail. Omitting `waitBusy` is fail-fast: a call landing mid-gesture answers `USER_BUSY` rather than queueing.

## Extends

- [`CallOptions`](CallOptions.md)

## Extended by

- [`PreconditionCallOptions`](PreconditionCallOptions.md)

## Properties

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
