# Interface: ChangedParams

Payload of `state.changed` — the canonical notification envelope (ADR 0083
§2.4), field for field. CapabilityNotification.h is the core's in-process
form of the same payload; this is its wire form, and no driver re-shapes it.

## Properties

### changes

```ts
changes: string[];
```

A coarse list of what changed (`["tracks"]`, affected job ids), so a peer
can narrow the re-fetch. May be empty — never a substitute for the
snapshot, since notifications can be coalesced.

***

### channel

```ts
channel: string;
```

The revisioned subject that moved, as the registry's `notification`
declarations spell it (`"jobs"`). A peer re-fetches this subject's
snapshot; an undeclared channel is never sent.

***

### revision

```ts
revision: number;
```

The channel's monotonic revision *after* the change. A peer compares it
against the revision its last snapshot was stamped with and re-fetches
only when this one is newer, which is what makes reconnects and dropped
notifications self-correcting rather than silently stale.
