# Interface: TrackReorderParams

Arguments for `track reorder`.

## Properties

### toIndex

```ts
toIndex: number;
```

0-based position to move to, in the same region the track already lives in. A track cannot leave its region: the pinned Video and Marker bands hold only their own type (ADR 0104), so a cross-region move is refused rather than silently clamped.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

0-based index in the arrangement (users see tracks numbered from 1).

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format, e.g. `\{12345678-abcd-...\}`. Required to address a track in the pinned Video or Marker band, which `--track-index` cannot name.
