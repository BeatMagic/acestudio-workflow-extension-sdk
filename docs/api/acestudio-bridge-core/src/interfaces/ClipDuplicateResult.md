# Interface: ClipDuplicateResult

Success payload of `clip duplicate`.

## Properties

### clipName

```ts
clipName: string;
```

Display name of the copy.

***

### clipType

```ts
clipType: string;
```

Clip type of the copy.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the new copy, with braces.

***

### geometry

```ts
geometry: {
  clipIn: number;
  clipInSec: number;
  dur: number;
  durSec: number;
  end: number;
  endSec: number;
  nativeUnit: "second" | "tick";
  pos: number;
  posSec: number;
  sourceDur: number;
  sourceDurSec: number;
  sourcePos: number;
  sourcePosSec: number;
};
```

A clip's geometry in the *wire* vocabulary a write speaks, in both units. The bare names are ticks and the `*Sec` names are seconds; `nativeUnit` says which of the two the clip stores, and so which is exact (ADR 0032 §3-4). A geometry write addresses the visible region: `pos` and `dur` are where the clip starts and how long it is, and `clipIn` slides which part of the source shows (ledger §2.6, `ClipWriteUtils.h`). The echo answers under those same names, so `clip move \{pos: X\}` reports `pos: X`. Reusing [`ClipGeometry`], whose `pos` is the source start, would answer a different number under the very key the caller just set.

#### clipIn

```ts
clipIn: number;
```

Offset into the source the visible region starts at — what a write's `clipIn` sets.

#### clipInSec

```ts
clipInSec: number;
```

`clipIn` in seconds. For a second-native clip this is the exact trim — the value the entity stores — and the tick field above is the conversion.

#### dur

```ts
dur: number;
```

Visible region duration — what a write's `dur` sets.

#### durSec

```ts
durSec: number;
```

`dur` in seconds.

#### end

```ts
end: number;
```

Visible region end on the global timeline (pos + dur). Reported, never accepted: a caller wanting an end names `pos` and `dur`, and reads this back to check itself.

#### endSec

```ts
endSec: number;
```

`end` in seconds.

#### nativeUnit

```ts
nativeUnit: "second" | "tick";
```

Which unit an entity's geometry is stored in — the one value that is exact, with the other reported beside it as a conversion under the current tempo curve (ADR 0032 §2-4). Declared here because every group that reports geometry names it. It follows the entity's own anchoring, which `PatternFactory::preferredGeometryTimeUnit` is the source of truth for: media that plays at wall-clock speed is second-native, content written against the grid is tick-native.

#### pos

```ts
pos: number;
```

Visible region start on the global timeline — what a write's `pos` sets.

#### posSec

```ts
posSec: number;
```

`pos` in seconds.

#### sourceDur

```ts
sourceDur: number;
```

Duration of the full editable (source) region.

#### sourceDurSec

```ts
sourceDurSec: number;
```

`sourceDur` in seconds.

#### sourcePos

```ts
sourcePos: number;
```

Start of the full editable (source) region on the global timeline. Reported for completeness; a write never addresses it directly, because a move slides the source underneath so the visible region lands where asked.

#### sourcePosSec

```ts
sourcePosSec: number;
```

`sourcePos` in seconds.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in.

***

### sourceClipUuid

```ts
sourceClipUuid: string;
```

UUID of the clip that was copied.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of that track in `region` — where the copy actually landed, which `onOccupied=relocate` can make differ from what was asked. Absent together with `region` when the project cannot place the track, which is an inconsistency rather than anything a caller did.

***

### trackName

```ts
trackName: string;
```

Name of the track the copy landed on. Differs from the requested track when `onOccupied=relocate` stacked it on a new one.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track, with braces.
