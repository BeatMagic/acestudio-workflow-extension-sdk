# Interface: PreconditionCallOptions

Options a write that honors the stale-write precondition additionally accepts. Only those writes get `ifMatch`: an operation that has not opted into the fingerprint gate accepts a carried token and ignores it, so offering one here would type-check into a write that reads as guarded and is not. Omitting it is an unguarded write.

## Extends

- [`MutatingCallOptions`](MutatingCallOptions.md)

## Properties

### ifMatch?

```ts
optional ifMatch?: Fingerprint;
```

The fingerprint from a prior read of *this* operation's content; the write fails `STALE_WRITE` if it changed since, or `FINGERPRINT_SCOPE_MISMATCH` if the token came from a read of something else.

***

### signal?

```ts
optional signal?: AbortSignal;
```

Abort the local wait. The host-side work is unaffected.

#### Inherited from

[`MutatingCallOptions`](MutatingCallOptions.md).[`signal`](MutatingCallOptions.md#signal)

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Local deadline for this call, in milliseconds.

#### Inherited from

[`MutatingCallOptions`](MutatingCallOptions.md).[`timeoutMs`](MutatingCallOptions.md#timeoutms)

***

### waitBusy?

```ts
optional waitBusy?: number;
```

Wait up to this many milliseconds for the user to finish before failing `USER_BUSY`.

#### Inherited from

[`MutatingCallOptions`](MutatingCallOptions.md).[`waitBusy`](MutatingCallOptions.md#waitbusy)
