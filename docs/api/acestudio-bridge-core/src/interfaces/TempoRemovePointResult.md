# Interface: TempoRemovePointResult

Success payload of `tempo remove-point`.

## Properties

### pointCount

```ts
pointCount: number;
```

Number of points in the table after the write.

***

### pos

```ts
pos: number;
```

The position acted on, in project ticks -- resolved, so a caller that passed a musical or clock form learns which tick it hit.

***

### replaced

```ts
replaced: boolean;
```

Whether a point already existed at `pos`. True for a `set-point` that overwrote one and for every successful `remove-point`; false for a `set-point` that inserted a new point.
