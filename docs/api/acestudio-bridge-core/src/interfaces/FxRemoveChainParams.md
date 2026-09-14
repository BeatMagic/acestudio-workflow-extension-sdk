# Interface: FxRemoveChainParams

Arguments for `fx remove-chain`.

## Properties

### preset

```ts
preset: string;
```

What to remove, by its path in the library: a chain (`Vocal/Warm Stack`), or a folder (`Vocal`, or `Vocal/`) — which has to be empty. A folder that still holds a chain or another folder is refused with FOLDER_NOT_EMPTY, so one call cannot trash a subtree. Where a chain and a folder share a path the chain is meant; a trailing `/` means the folder.
