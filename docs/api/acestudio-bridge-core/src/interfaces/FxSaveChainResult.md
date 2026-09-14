# Interface: FxSaveChainResult

Success payload of `fx save-chain`.

## Properties

### insertCount

```ts
insertCount: number;
```

How many inserts the file holds.

***

### path

```ts
path: string;
```

Absolute path of the written `.acefxchainpreset` file.

***

### preset

```ts
preset: string;
```

The stored chain's path in the library, as the library spells it.

***

### replaced

```ts
replaced: boolean;
```

Whether a chain already at that path was overwritten.
