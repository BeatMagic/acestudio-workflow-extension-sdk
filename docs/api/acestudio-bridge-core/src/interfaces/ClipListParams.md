# Interface: ClipListParams

Arguments for `clip list`.

## Properties

### trackIndex?

```ts
optional trackIndex?: number;
```

Track index (0-based) in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format. Required to address a track in the pinned Video or Marker band, which `trackIndex` cannot name.
