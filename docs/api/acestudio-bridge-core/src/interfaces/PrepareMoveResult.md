# Interface: PrepareMoveResult

Result of `session.prepareMove`.

## Properties

### ready

```ts
ready: boolean;
```

True once the peer has stopped writing, flushed its state to disk, and
released every handle under the project folder. The host proceeds with the
copy only on a `true`: a `false`, an error, or a reply that misses the
host's deadline all fail the relocation rather than copying a tree someone
is still writing to.

The quiesce is an instruction rather than a request, so an SDK gives its
author no way to answer `false`. The field carries a bool so that a peer
which cannot comply stays distinguishable from one that has — reaching it
means the peer is in a state it cannot quiesce from, which is a defect to
fix in the peer rather than a supported reply.
