# Interface: CaretGetResult

Success payload of `caret get`.

## Properties

### focus

```ts
focus: string;
```

Which UI area holds caret focus: `arrangement` (track view) or `editor` (pattern editor). Folded in from the retired `marker get-focus`, because a caret position without the view that owns it is ambiguous.

***

### nativeUnit

```ts
nativeUnit: "tick";
```

The unit a caret position is authoritative in. Always `tick`: the caret sits on the grid — `TimelineState` holds it as a tick — so the `sec` reported beside it is that tick put through the current tempo curve. Its own single-member enum rather than the shared `GeometryNativeUnit`, on the rule in ADR 0032 §4.

***

### rawTrackRow

```ts
rawTrackRow: number;
```

The caret's row in the view's row space, where a pinned band takes negative rows. Named `raw` because that is the whole point: unprefixed, it is indistinguishable from a region-local index, and on an arrangement track the two coincide — so a caller tests it successfully and misaddresses the moment a pinned content track is involved (ADR 0129 §6). Reported rather than withheld, because a caller working in screen geometry has nowhere else to get it.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, `video`, `marker` or `chord`. Position 1 names a different track in each band (ADR 0104), so the index is unreadable without it.

***

### scope

```ts
scope: string;
```

The scope actually used — `global` or `editor`. `arrangement` normalizes to `global`, so the answer names one of the two the caret really has.

***

### sec

```ts
sec: number;
```

The same instant in seconds, counted in whichever space `tick` counts in — global seconds under `global` scope, and under `editor` scope the elapsed wall clock from the open clip's start, so `sec` is 0 exactly where `tick` is. Editor-local seconds rather than global ones, because a field that changed coordinate space from the tick beside it would be the trap the pair exists to close: the two would name different instants under the one contract that says they name the same one. `editor tick-range`'s `beginSec` is the offset that lifts an editor-scope reading to global seconds, and it is exact — both are measured from the same converted instant, so `sec + beginSec` is the caret's global seconds. Always a conversion, never the exact value: the caret is tick-native (`nativeUnit`). Reported because lining the caret up against video is seconds work and the conversion needs the tempo curve (ADR 0032 §3).

***

### tick

```ts
tick: number;
```

Caret position in ticks: global ticks under `global` scope, ticks local to the open clip under `editor` scope.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of the caret's track in `region` (ADR 0129 §3). Users see tracks starting from 1. Absent together with `region` when the project cannot place the track.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

UUID of the caret's track, in braces. The handle to store, since an index moves when tracks are added or reordered (ADR 0129 §2). `master` when the caret is on the master bus, which is the one track this reports without a `trackIndex` and `region` beside it: the master belongs to no index space, so its well-known id is the whole of what names it — the same answer `track get` gives for it (ADR 0129 §3).
