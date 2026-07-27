# Interface: TransportLoopResult

Success payload of `transport loop`.

## Properties

### active

```ts
active: boolean;
```

Whether the loop region is engaged.

***

### endTick

```ts
endTick: number;
```

Exclusive upper bound, in project ticks.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the loop region; carry into a later `transport set-loop` to fail loudly (STALE_WRITE) if the region changed in between.

***

### isValid

```ts
isValid: boolean;
```

Whether a loop region has been configured at all.

***

### startTick

```ts
startTick: number;
```

Inclusive lower bound, in project ticks.
