# Interface: MidiparamClearResult

Success payload of `midiparam clear`.

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

The lane's content token *after* the clear — the empty lane's token.

***

### lane

```ts
lane: string;
```

The lane cleared.

***

### removedCount

```ts
removedCount: number;
```

Anchors the clear removed. 0 means the lane was already empty — the clear is idempotent, not an error.
