# Interface: FxSetParams

Arguments for `fx set`.

## Properties

### bypassed?

```ts
optional bypassed?: boolean;
```

Whether the insert is bypassed. Separate from `enabled` because the mixer keeps them separate.

***

### enabled?

```ts
optional enabled?: boolean;
```

Whether the insert processes at all. A disabled insert keeps its state.

***

### insert?

```ts
optional insert?: string;
```

Instance id of the insert, as `fx list` reports it.

***

### name?

```ts
optional name?: string;
```

Rename the insert. An empty string clears the rename, so the plugin's own display name shows again.

***

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see the header.

***

### slot?

```ts
optional slot?: number;
```

0-based slot in the chain. Mutually exclusive with `insert`.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, or `master` for the master bus.
