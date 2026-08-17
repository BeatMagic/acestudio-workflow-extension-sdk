# Interface: ConvertTimeToTickResult

Success payload of `convert time-to-tick`.

## Properties

### tick?

```ts
optional tick?: number;
```

Corresponding project tick position, accounting for tempo automation. Present exactly when `time` was given.

***

### ticks?

```ts
optional ticks?: number[];
```

One project tick per input, in input order. Present exactly when `times` was given.
