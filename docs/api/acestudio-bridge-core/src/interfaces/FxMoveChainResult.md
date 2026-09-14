# Interface: FxMoveChainResult

Success payload of `fx move-chain`.

## Properties

### path

```ts
path: string;
```

Absolute path of the file now.

***

### preset

```ts
preset: string;
```

The chain's path in the library now, as the library spells it. The basename is sanitized for the filesystem, so it need not spell the typed name exactly.

***

### previous

```ts
previous: string;
```

Its path before the move.
