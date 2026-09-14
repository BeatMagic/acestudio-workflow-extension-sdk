# Interface: TransportStateResult

Success payload of `transport state`.

## Properties

### nativeUnit

```ts
nativeUnit: "second";
```

The unit the playhead is authoritative in. Always `second`: playback position is wall clock the audio engine holds directly (`Playback::playbackPosition()`), so the tick reported beside it is that instant put back through the tempo curve. This group's two dual-unit pairs are native in OPPOSITE units, which is why each names its own enum instead of sharing one: the playhead is seconds and the loop region is ticks, so a single `transport.nativeUnit` would be wrong for one of them. Nothing but the wire says which value a consumer may round.

***

### position

```ts
position: number;
```

Current playback head position in seconds from the start of the project. The exact value — the playhead is second-native.

***

### positionTick

```ts
positionTick: number;
```

The same instant in project ticks, for a caller working on the grid. A conversion under the current tempo curve, and rounded to a whole tick: read `position` when the exact instant matters (ADR 0032 §2). Reported because note, marker and loop work is tick work, and a caller holding only seconds had to spend a `convert time-to-tick` round trip to ask "where is the playhead on the grid".

***

### status

```ts
status: string;
```

Transport state: `stopped`, `playing`, or `playing but interrupted` (play intention active but audio paused pending synthesis).
