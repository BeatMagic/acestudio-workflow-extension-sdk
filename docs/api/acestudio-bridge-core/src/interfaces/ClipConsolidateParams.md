# Interface: ClipConsolidateParams

Arguments for `clip consolidate`.

## Properties

### name?

```ts
optional name?: string;
```

Name for the consolidated clip(s). Omit for the generated `Consolidate_\<n\>_\<track\>`, which is what the timeline's own Consolidate produces.

***

### rangeBegin

```ts
rangeBegin: number;
```

Start of the range to consolidate, on the global timeline, in ticks.

***

### rangeEnd

```ts
rangeEnd: number;
```

End of the range (exclusive), on the global timeline, in ticks.

***

### trackUuids

```ts
trackUuids: string[];
```

Track to consolidate within. Repeat for several tracks; each produces its own consolidated clip, and the whole call is one undo entry.
