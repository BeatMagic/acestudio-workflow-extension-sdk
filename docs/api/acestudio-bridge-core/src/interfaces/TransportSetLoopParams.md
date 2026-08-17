# Interface: TransportSetLoopParams

Arguments for `transport set-loop`.

## Properties

### active?

```ts
optional active?: boolean;
```

Whether the loop region is engaged. Omit to leave the flag untouched.

***

### endTick?

```ts
optional endTick?: number;
```

Exclusive upper bound, in project ticks. Must be greater than `startTick`.

***

### startTick?

```ts
optional startTick?: number;
```

Inclusive lower bound, in project ticks. Must be non-negative and less than `endTick`.
