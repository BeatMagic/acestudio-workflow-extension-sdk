# Interface: ConvertTickToTimeParams

Arguments for `convert tick-to-time`.

## Properties

### tick?

```ts
optional tick?: number;
```

Project tick position to convert. Must be non-negative — the handler refuses a negative value.

***

### ticks?

```ts
optional ticks?: number[];
```

Project tick positions to convert. Each must be non-negative. An empty array is a batch of nothing and answers an empty `times`, rather than being refused as a missing argument.
