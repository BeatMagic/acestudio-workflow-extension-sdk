# Interface: ConvertTimeToTickParams

Arguments for `convert time-to-tick`.

## Properties

### time?

```ts
optional time?: number;
```

Time in seconds to convert. Must be non-negative — the handler refuses a negative value.

***

### times?

```ts
optional times?: number[];
```

Times in seconds to convert. Each must be non-negative. An empty array answers an empty `ticks`.
