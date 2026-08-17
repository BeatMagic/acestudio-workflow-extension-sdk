# Interface: ChoirRemoveParams

Arguments for `choir remove`.

## Properties

### member

```ts
member: number;
```

Which member to remove. `0` is the leader and is refused.

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
