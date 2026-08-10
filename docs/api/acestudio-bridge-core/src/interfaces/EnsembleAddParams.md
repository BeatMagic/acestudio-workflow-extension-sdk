# Interface: EnsembleAddParams

Arguments for `ensemble add`.

## Properties

### at?

```ts
optional at?: number | null;
```

Where to insert the new member. Defaults to the end. `0` makes the new instrument the leader and pushes the rest down.

***

### source

```ts
source: string;
```

**Required.** Which instrument to add, by display name or ref — the same thing `sound-source load --source` accepts.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format.
