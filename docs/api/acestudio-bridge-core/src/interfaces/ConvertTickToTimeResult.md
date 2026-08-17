# Interface: ConvertTickToTimeResult

Success payload of `convert tick-to-time`.

## Properties

### time?

```ts
optional time?: number;
```

Corresponding position in seconds, accounting for tempo automation. Present exactly when `tick` was given.

***

### times?

```ts
optional times?: number[];
```

One position in seconds per input, in input order, accounting for tempo automation. Present exactly when `ticks` was given.
