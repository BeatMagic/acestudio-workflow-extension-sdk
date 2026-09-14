# Interface: MidiparamSetVelocityResult

Success payload of `midiparam set-velocity`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The clip the named notes belong to.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

The clip's velocity content token *after* the write — what to carry into the next guarded write without re-reading.

***

### updatedCount

```ts
updatedCount: number;
```

Notes whose velocity the write changed. A named note already at the value is a no-op and is not counted, so 0 means the write left no undo entry.
