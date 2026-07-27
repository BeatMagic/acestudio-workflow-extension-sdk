# Interface: TransportSetLoopParams

Arguments for `transport set-loop`.

## Properties

### active?

```ts
optional active?: boolean | null;
```

Whether the loop region is engaged. Pass `--active` to enable, `--no-active` to disable. Omit to leave the flag untouched.

***

### endTick?

```ts
optional endTick?: number | null;
```

Loop region end (exclusive). Ticks (`3840t`), clock time (`1.5s`), or musical position (`4.1.0`). See `help time-values`.

***

### startTick?

```ts
optional startTick?: number | null;
```

Loop region start. Ticks (`3840t`), clock time (`1.5s`), or musical position (`4.1.0`). Must be \< `end-tick`. See `help time-values`.
