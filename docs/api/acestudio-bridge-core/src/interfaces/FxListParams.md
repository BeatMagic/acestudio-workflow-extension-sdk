# Interface: FxListParams

Arguments for `fx list`.

## Properties

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see the header.

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
