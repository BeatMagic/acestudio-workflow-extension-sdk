# Interface: EnsembleAddParams

Arguments for `ensemble add`.

## Properties

### at?

```ts
optional at?: number;
```

Where to insert the new member. Omit for the end. `0` makes the new instrument the leader and pushes the rest down.

***

### source

```ts
source: string;
```

Which instrument to add, by display name or ref — the same thing `sound-source load --source` accepts.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format.
