# Interface: TempoGetAnalysisResult

Success payload of `tempo get-analysis`.

## Properties

### analysisId

```ts
analysisId: string;
```

Echoed so an answer can be matched back to the id that asked for it.

***

### anchorSec?

```ts
optional anchorSec?: number;
```

Where the analyzed audio's origin sat in the project, in seconds, when it was analyzed — so project seconds are `anchorSec` plus any position below. This is what `tempo apply-beat-analysis` uses when the caller passes no `anchor`. ABSENT for an analysis of a loose file: the file has no position in the project, so the apply needs its `anchor` argument. Present for a clip analysis, whose position was captured with the analysis. It describes the position BEFORE any apply. A successful apply moves that audio by its own `offsetSec`, so on an `applied` analysis this no longer says where the audio is now.

***

### beats

```ts
beats: number[];
```

Every detected beat, in source seconds, ascending. UNFILTERED: this is the set Studio's own audio-clip editor draws.

***

### bpm

```ts
bpm: number;
```

The single tempo estimate, in BPM, or 0 when the audio carries too few beats to estimate one. Rounded to the nearest integer, this is the BPM badge Studio draws on the clip.

***

### downbeats

```ts
downbeats: number[];
```

Every detected downbeat (bar start), in source seconds, ascending. UNFILTERED, for the same reason `beats` is — it is what a human sees.

***

### gridDownbeats

```ts
gridDownbeats: number[];
```

The SPUR-FILTERED downbeats, in source seconds: a detection closer than roughly half the median bar to the one before it is dropped, so a doubled detection cannot fabricate a half-length bar. This is the set `tempo apply-beat-analysis` derives its grid from, and the set `timeSignatures` was counted against, so it can be shorter than `downbeats`. Both are reported because the gap between them is real: what the editor draws and what the apply uses are different lists, and a caller comparing one against the other needs to be told which is which.

***

### nativeUnit

```ts
nativeUnit: "second";
```

The unit an analysis's positions are authoritative in. Always `second`: a beat analysis measures the audio it read, and the ticks under `projection` are that measurement converted through the project's current tempo curve.

***

### projection?

```ts
optional projection?: {
  anchorTick: number;
  beats: number[];
  downbeats: number[];
  gridDownbeats: number[];
};
```

An analysis re-addressed onto the project's CURRENT grid, using `anchorSec`. Every value is a project tick under the tempo curve the project has right now — which `tempo apply-beat-analysis` would replace. So these say where the analyzed beats fall on today's timeline, not where they will fall after an apply.

#### anchorTick

```ts
anchorTick: number;
```

Project tick of the analyzed audio's origin — `anchorSec` converted.

#### beats

```ts
beats: number[];
```

`beats`, in project ticks.

#### downbeats

```ts
downbeats: number[];
```

`downbeats`, in project ticks.

#### gridDownbeats

```ts
gridDownbeats: number[];
```

`gridDownbeats`, in project ticks.

***

### state

```ts
state: "ready" | "applied";
```

Whether an analysis has been landed on the project yet.

***

### tempoCurve

```ts
tempoCurve: {
  bpm: number;
  posSec: number;
}[];
```

The multi-segment tempo estimate, ascending by `posSec`. Empty exactly when `bpm` is 0 — both come from the same estimate, so the single value is always one of these segments.

#### bpm

```ts
bpm: number;
```

The segment's tempo, in BPM.

#### posSec

```ts
posSec: number;
```

Where the segment starts, in source seconds.

***

### timeSignatures

```ts
timeSignatures: {
  barIndex: number;
  denominator: number;
  numerator: number;
  posSec: number;
}[];
```

The analyzed meter, one entry per numerator change, the first bar always emitting one. Empty when the analysis is too degenerate to bound a bar (fewer than two downbeats survive the filter), where `gridDownbeats` may still be filled.

#### barIndex

```ts
barIndex: number;
```

Index into `gridDownbeats` of the bar this entry starts at.

#### denominator

```ts
denominator: number;
```

Always 4. The detector analyzes no denominator, so this carries no information and is reported only to make the pair read as a time signature.

#### numerator

```ts
numerator: number;
```

Beats per bar, counted as the number of detected beats inside the bar, with brief off-runs snapped to the dominant value.

#### posSec

```ts
posSec: number;
```

Where that bar starts, in source seconds. The same value as `gridDownbeats[barIndex]`, repeated so a reader need not index back.

***

### window

```ts
window: {
  lengthSec: number;
  offsetSec: number;
};
```

The stretch of source audio an analysis covers.

#### lengthSec

```ts
lengthSec: number;
```

How much audio was analyzed, in seconds.

#### offsetSec

```ts
offsetSec: number;
```

Where the analyzed range starts inside the source audio, in seconds from that audio's own origin. For a clip, its trim-in point.
