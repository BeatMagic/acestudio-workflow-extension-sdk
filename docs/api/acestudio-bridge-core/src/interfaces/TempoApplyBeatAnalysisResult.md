# Interface: TempoApplyBeatAnalysisResult

Success payload of `tempo apply-beat-analysis`.

## Properties

### movedClipCount

```ts
movedClipCount: number;
```

How many clips and markers were re-anchored to keep their seconds. MIDI-like clips (Sing / Instrument / GenericMidi / Chord) are never counted: they keep their ticks and re-read under the new grid.

***

### offsetSec

```ts
offsetSec: number;
```

Seconds every pre-existing non-MIDI-like item moved later so the first detected downbeat lands on a bar line. Always \>= 0.

***

### pointCount

```ts
pointCount: number;
```

Number of tempo points the applied grid installed.

***

### signatureCount

```ts
signatureCount: number;
```

Number of time-signature entries the applied grid installed.
