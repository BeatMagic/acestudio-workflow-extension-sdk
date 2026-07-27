# Interface: TempoGetResult

Success payload of `tempo get`.

## Properties

### pointCount

```ts
pointCount: number;
```

Number of entries in points (convenience field).

***

### points

```ts
points: {
  bend: number;
  pos: number;
  value: number;
}[];
```

All tempo automation points, in ascending pos order.

#### bend

```ts
bend: number;
```

Curve control toward the next point; 0.0 = linear.

#### pos

```ts
pos: number;
```

Point position, in project ticks.

#### value

```ts
value: number;
```

Tempo at this point, in BPM.
