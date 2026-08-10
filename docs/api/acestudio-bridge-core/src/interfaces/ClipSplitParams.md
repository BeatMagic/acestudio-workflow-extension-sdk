# Interface: ClipSplitParams

Arguments for `clip split`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip to split, with or without curly braces.

***

### pos

```ts
pos: number;
```

Where to cut, on the global timeline. Must fall strictly inside the clip and leave both halves at least one grid cell long.
