# Interface: CaretGetResult

Success payload of `caret get`.

## Properties

### focus

```ts
focus: string;
```

Which UI area holds caret focus: `arrangement` (track view) or `editor` (pattern editor). Folded in from the retired `marker get-focus`, because a caret position without the view that owns it is ambiguous.

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

UUID of the caret's track, in braces. The handle to store, since an index moves when tracks are added or reordered (ADR 0129 §2).
