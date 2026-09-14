# Interface: TransportLoopResult

Success payload of `transport loop`.

## Properties

### active

```ts
active: boolean;
```

Whether the loop region is engaged.

***

### endSec

```ts
endSec: number;
```

`endTick` in seconds, on the same terms.

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

Content fingerprint of the loop region (ADR 0088 §5); carry it into a later `transport set-loop` to fail loudly (STALE_WRITE) if the region changed in between.

***

### isValid

```ts
isValid: boolean;
```

Whether a loop region has been configured at all.

***

### nativeUnit

```ts
nativeUnit: "tick";
```

The unit the loop region is authoritative in. Always `tick`: `Project::loop()` stores the bounds as ticks, so the seconds reported beside them are conversions under the current tempo curve.

***

### startSec

```ts
startSec: number;
```

`startTick` in seconds, under the current tempo curve. A conversion, so a tempo edit moves it while `startTick` stays put. Reported because a caller looping over video or aligning to a wall-clock cue reads the region in seconds, and the conversion needs the tempo curve (ADR 0032 §3).

***

### startTick

```ts
startTick: number;
```

Inclusive lower bound, in project ticks. The exact value — the loop region is tick-native.
