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
  dur: number;
  end: number;
  pos: number;
  sourceDur: number;
  sourcePos: number;
};
```

A clip's geometry in the *wire* vocabulary a write speaks, always in ticks. A geometry write addresses the visible region: `pos` and `dur` are where the clip starts and how long it is, and `clipIn` slides which part of the source shows (ledger §2.6, `ClipWriteUtils.h`). The echo answers under those same names, so `clip move \{pos: X\}` reports `pos: X`. Reusing [`ClipGeometry`], whose `pos` is the source start, would answer a different number under the very key the caller just set.

#### clipIn

```ts
clipIn: number;
```

Offset into the source the visible region starts at — what a write's `clipIn` sets.

#### dur

```ts
dur: number;
```

Visible region duration — what a write's `dur` sets.

#### end

```ts
end: number;
```

Visible region end on the global timeline (pos + dur). Reported, never accepted: a caller wanting an end names `pos` and `dur`, and reads this back to check itself.

#### pos

```ts
pos: number;
```

Visible region start on the global timeline — what a write's `pos` sets.

#### sourceDur

```ts
sourceDur: number;
```

Duration of the full editable (source) region.

#### sourcePos

```ts
sourcePos: number;
```

Start of the full editable (source) region on the global timeline. Reported for completeness; a write never addresses it directly, because a move slides the source underneath so the visible region lands where asked.

***

### sourceClipUuid

```ts
sourceClipUuid: string;
```

UUID of the clip that was copied.

***

### trackName

```ts
trackName: string;
```

Name of the track the copy landed on. Differs from the requested track when `onOccupied=relocate` stacked it on a new one.
