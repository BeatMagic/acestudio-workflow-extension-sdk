# Interface: ChangeEvent

What a change notification carries (ADR 0083 §2.4). It is a hint to re-read, never the new state: notifications coalesce, so a listener that treats `changes` as the complete diff will drift. Compare `revision` against the one your last snapshot was stamped with, and re-fetch when it is behind.

## Properties

### changes

```ts
readonly changes: readonly string[];
```

Coarse list of what changed, to narrow the re-fetch. May be empty.

***

### revision

```ts
readonly revision: number;
```

The channel's monotonic revision after the change.
