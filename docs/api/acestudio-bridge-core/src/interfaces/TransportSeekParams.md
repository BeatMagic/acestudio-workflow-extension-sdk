# Interface: TransportSeekParams

Arguments for `transport seek`.

## Properties

### time

```ts
time: number;
```

Time position. Seconds (`1.5s`, `250ms`), clock time (`1:23.5`), or a tick/musical position converted to seconds (`3840t`, `4.1.0`). Must be non-negative. Required. See `help time-values`.
