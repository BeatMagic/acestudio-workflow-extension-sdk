# Interface: ClipConsolidateParams

Arguments for `clip consolidate`.

## Properties

### name?

```ts
optional name?: string | null;
```

Name for the consolidated clip(s). Omit for the generated `Consolidate_\<n\>_\<track\>`, which is what the timeline's own Consolidate produces.

***

### rangeBegin

```ts
rangeBegin: number;
```

Start of the range to consolidate, on the global timeline. Ticks (`3840t`), clock time (`1.5s`), or a musical position (`4.1.0`).

***

### rangeEnd

```ts
rangeEnd: number;
```

End of the range (exclusive), on the global timeline.

***

### trackUuids

```ts
trackUuids: string[];
```

Track to consolidate within. Repeat for several tracks; each produces its own consolidated clip, and the whole call is one undo entry.

Tracks are named by id, not index: indices shift as tracks come and go, and this op deletes clips, so a stale index is worth designing out. Read them from `track list`.
