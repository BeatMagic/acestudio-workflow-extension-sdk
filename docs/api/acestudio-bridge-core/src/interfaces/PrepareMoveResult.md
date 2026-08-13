# Interface: PrepareMoveResult

Result of `session.prepareMove`.

## Properties

### ready

```ts
ready: boolean;
```

True once the peer has stopped writing, flushed its state to disk, and
released every handle under the session folder. The host proceeds with the
copy only on a `true`: a `false`, or a reply that misses the host's
deadline, fails the relocation rather than copying a tree someone is still
writing to.
