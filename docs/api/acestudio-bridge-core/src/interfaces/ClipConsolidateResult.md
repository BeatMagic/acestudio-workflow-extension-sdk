# Interface: ClipConsolidateResult

Success payload of `clip consolidate`.

## Properties

### clips

```ts
clips: {
  clipName: string;
  clipType: string;
  clipUuid: string;
  consolidatedClipCount: number;
  geometry: {
     clipIn: number;
     dur: number;
     end: number;
     pos: number;
     sourceDur: number;
     sourcePos: number;
  };
  trackName: string;
  trackUuid: string;
}[];
```

One consolidated clip per track that had material in the range. A named track with nothing in the range is skipped rather than producing an empty clip.

#### clipName

```ts
clipName: string;
```

Generated name, `Consolidate_\<n\>_\<track\>` unless `name` was given.

#### clipType

```ts
clipType: string;
```

Clip type, matching its track.

#### clipUuid

```ts
clipUuid: string;
```

Id of the consolidated clip.

#### consolidatedClipCount

```ts
consolidatedClipCount: number;
```

How many source clips contributed to this one.

#### geometry

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

##### geometry.clipIn

```ts
clipIn: number;
```

Offset into the source the visible region starts at — what a write's `clipIn` sets.

##### geometry.dur

```ts
dur: number;
```

Visible region duration — what a write's `dur` sets.

##### geometry.end

```ts
end: number;
```

Visible region end on the global timeline (pos + dur). Reported, never accepted: a caller wanting an end names `pos` and `dur`, and reads this back to check itself.

##### geometry.pos

```ts
pos: number;
```

Visible region start on the global timeline — what a write's `pos` sets.

##### geometry.sourceDur

```ts
sourceDur: number;
```

Duration of the full editable (source) region.

##### geometry.sourcePos

```ts
sourcePos: number;
```

Start of the full editable (source) region on the global timeline. Reported for completeness; a write never addresses it directly, because a move slides the source underneath so the visible region lands where asked.

#### trackName

```ts
trackName: string;
```

Name of that track.

#### trackUuid

```ts
trackUuid: string;
```

Id of the track it was placed on.

***

### rangeBegin

```ts
rangeBegin: number;
```

Range start actually used, in ticks.

***

### rangeEnd

```ts
rangeEnd: number;
```

Range end actually used (exclusive), in ticks.

***

### trackCount

```ts
trackCount: number;
```

How many tracks produced a consolidated clip — at most the number of `trackUuids` given.
