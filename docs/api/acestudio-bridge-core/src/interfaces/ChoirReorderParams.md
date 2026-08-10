# Interface: ChoirReorderParams

Arguments for `choir reorder`.

## Properties

### member

```ts
member: number;
```

*Required.** Which member to move.

***

### to

```ts
to: number;
```

*Required.** Where to move it. `0` promotes it to leader.

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
