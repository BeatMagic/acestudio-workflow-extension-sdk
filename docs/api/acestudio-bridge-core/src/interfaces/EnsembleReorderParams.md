# Interface: EnsembleReorderParams

Arguments for `ensemble reorder`.

## Properties

### member

```ts
member: number;
```

Which member to move.

***

### to

```ts
to: number;
```

Where to move it. `0` promotes it to leader.

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
