# Interface: ClipResizeResult

Success payload of `clip resize`.

## Properties

### clipName

```ts
clipName: string;
```

Display name of the clip.

***

### clipType

```ts
clipType: string;
```

Clip type: `sing`, `instrument`, `genericMidi`, `audio`, `video`, `chord`, or `marker`.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip, with braces.

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

### warnings?

```ts
optional warnings?: {
  code: string;
  hint?: string;
}[];
```

Absent when the write did exactly what was asked, which is the ordinary case. Declared on the result rather than merged into an envelope beside it, because a result the declared type does not describe is the type ADR 0121 §3 calls one that lies.

#### code

```ts
code: string;
```

SCREAMING_SNAKE_CASE identifier: `CLIP_CLAMPED_TO_SOURCE` when the requested duration ran past the end of a media clip's source and was clamped to what remained, `CHORD_CLIP_NOW_LOOPING` when a chord clip grew past its content so the content repeats.

#### hint?

```ts
optional hint?: string;
```

Human-readable detail composed at the warning site.
