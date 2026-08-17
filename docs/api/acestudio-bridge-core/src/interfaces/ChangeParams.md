# Interface: ChangeParams

What every change notification carries. There is no second, in-process form
of it: a driver fills this and the generated emitter sends it as declared.

## Properties

### changes

```ts
changes: string[];
```

A coarse list of what changed (`["tracks"]`, affected job ids), so a peer
can narrow the re-fetch. May be empty — never a substitute for the
snapshot, since notifications can be coalesced.

***

### revision

```ts
revision: number;
```

The subject's monotonic revision *after* the change. A peer compares it
against the revision its last snapshot was stamped with and re-fetches
only when this one is newer, which is what makes reconnects and dropped
notifications self-correcting rather than silently stale.
