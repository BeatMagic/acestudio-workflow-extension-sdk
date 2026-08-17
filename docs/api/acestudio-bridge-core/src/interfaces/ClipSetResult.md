# Interface: ClipSetResult

Success payload of `clip set`.

## Properties

### clipName

```ts
clipName: string;
```

Effective display name, auto-generated when the clip has no custom name.

***

### clipType

```ts
clipType: string;
```

Clip type.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip, with braces.

***

### color

```ts
color: string;
```

Effective color as upper-case `#RRGGBB`.

***

### geometry?

```ts
optional geometry?: {
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

### isColorLinkToTrack

```ts
isColorLinkToTrack: boolean;
```

True when the clip follows its track's color instead of carrying its own.

***

### rawName

```ts
rawName: string;
```

The custom name as stored. Empty when the clip falls back to an auto-generated name.
