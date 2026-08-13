# Interface: ClipListParams

Arguments for `clip list`.

## Properties

### trackIndex?

```ts
optional trackIndex?: number | null;
```

Track index (0-based) in the arrangement. Users see tracks starting from 1.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format, e.g. `\{12345678-abcd-...\}`. Required to address a track in the pinned Video or Marker band, which `--track-index` cannot name. `track list --type video --type marker` reports those uuids.
