# Interface: JobWaitOptions

What a bounded [JobHandle.wait](JobHandle.md#wait) may ask for.

## Properties

### pollIntervalMs?

```ts
optional pollIntervalMs?: number;
```

Least time between polls, in milliseconds, when the host answers a poll
immediately instead of holding it. Defaults to 250ms.

***

### signal?

```ts
optional signal?: AbortSignal;
```

Abort the local wait. The job is untouched — this stops watching, it does
not stop the work.

#### Throws

BridgeError with code `TIMEOUT`, unlike an expired `timeoutMs`: a
bound the caller declared has a defined outcome, an abort is the caller
changing their mind mid-wait.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Give up waiting after this many milliseconds and answer `timeout`. Omitted,
the wait runs until the job is terminal.

Waiting only observes: an expiry never cancels the job, and the work keeps
running (ADR 0084).
