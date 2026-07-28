# Interface: GrantProvenance

Where a grant came from, for the log line that explains a denial nobody
expected. Not a contract to branch on — read [Grant.tokens](Grant.md#tokens) for that.

## Properties

### granted

```ts
readonly granted: readonly string[];
```

Every name the host granted, verbatim — including any of the below.

***

### requested

```ts
readonly requested: readonly string[];
```

The capability names `connect()` asked for, in the caller's order.

***

### sessionId

```ts
readonly sessionId: string;
```

The session the host minted this grant for.

***

### unrecognized

```ts
readonly unrecognized: readonly string[];
```

Granted names these bindings cannot name: a first-party token, or one
minted after this SDK was generated. They are honoured on the wire and
absent from [Grant.tokens](Grant.md#tokens), which is why they are listed here rather
than dropped — a call failing `CAPABILITY_DENIED` for a token the host says
it granted is otherwise an unexplainable bug.
