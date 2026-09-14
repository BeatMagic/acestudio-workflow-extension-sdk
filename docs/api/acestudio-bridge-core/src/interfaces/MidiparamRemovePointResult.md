# Interface: MidiparamRemovePointResult

Success payload of `midiparam remove-point`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The clip written to.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

The lane's content token *after* the write — what to carry into the next guarded write without re-reading.

***

### lane

```ts
lane: string;
```

The lane written.

***

### pointCount

```ts
pointCount: number;
```

Anchors in the lane after the write.

***

### pos

```ts
pos: number;
```

The clip-local tick acted on.

***

### replaced

```ts
replaced: boolean;
```

Whether an anchor already existed at `pos`. True for a `set-point` that overwrote one and for every successful `remove-point`; false for a `set-point` that inserted a new anchor.
