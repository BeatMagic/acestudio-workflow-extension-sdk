# Interface: TransportSetLoopParams

Arguments for `transport set-loop`.

## Properties

### active?

```ts
optional active?: boolean;
```

Whether the loop region is engaged. Omit to leave the flag untouched.

***

### endSec?

```ts
optional endSec?: number;
```

The upper bound in seconds instead, on the same terms.

***

### endTick?

```ts
optional endTick?: number;
```

Exclusive upper bound, in project ticks. Must be greater than the start. Wins over `endSec` on the same terms.

***

### startSec?

```ts
optional startSec?: number;
```

The lower bound in seconds instead, converted under the tempo curve. Satisfies the start half of the pair on its own, so a caller working in wall clock never has to convert first.

***

### startTick?

```ts
optional startTick?: number;
```

Inclusive lower bound, in project ticks. Must be non-negative and less than the end. Wins over `startSec` when both are named: the region is tick-native, so ticks reach it unrounded (ADR 0032 §5).
