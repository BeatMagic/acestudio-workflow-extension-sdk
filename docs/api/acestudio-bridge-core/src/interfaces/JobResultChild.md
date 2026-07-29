# Interface: JobResultChild

What the ledger guarantees about every result child, whatever produced it.

## Properties

### id

```ts
readonly id: string;
```

The result id — what `client.job.place` and `discardResult` take.

***

### state

```ts
readonly state: "failed" | "pending" | "streaming" | "settled";
```

How far the result has settled. `streaming` means playable and still
growing in real time: the audio can be auditioned, and even placed, before
it settles, and a placed streaming pattern flips to the final version by
itself (ADR 0084). Only a `streamingCapable` class ever reaches it.
