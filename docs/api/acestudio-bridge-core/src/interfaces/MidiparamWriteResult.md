# Interface: MidiparamWriteResult

Success payload of `midiparam write`.

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

Anchors in the lane after the write — under a range write this can exceed `wroteCount` by the edge anchors planted to pin the join, plus whatever lay outside the span.

***

### wroteCount

```ts
wroteCount: number;
```

Anchors carried by the write.
