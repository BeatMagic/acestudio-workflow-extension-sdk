# Interface: FxMoveChainParams

Arguments for `fx move-chain`.

## Properties

### preset

```ts
preset: string;
```

The chain to move, by its path in the library.

***

### to

```ts
to: string;
```

Where it goes, the way `mv` takes a destination. A path that ends in `/`, or that names a folder which exists, is the folder to file the chain into under its current name; the empty string is the root. Any other path is the chain's new path — its last segment the new name, the segments before it the folder, created if missing. A `.` or `..` segment is refused. Refused with PRESET_EXISTS when a chain already sits at the destination, so a move cannot quietly produce two chains one path addresses. A destination that differs from the chain's own path only in letter case is the same path, and the move is a no-op.
