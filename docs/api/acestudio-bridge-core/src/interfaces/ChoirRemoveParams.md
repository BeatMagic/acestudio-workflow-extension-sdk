# Interface: ChoirRemoveParams

Arguments for `choir remove`.

## Properties

### member

```ts
member: number;
```

*Required.** Which member to remove. `0` is the leader and is refused.

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
