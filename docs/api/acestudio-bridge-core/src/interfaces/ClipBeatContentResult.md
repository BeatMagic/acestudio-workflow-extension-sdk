# Interface: ClipBeatContentResult

Success payload of `clip beat-content`.

## Properties

### analyzed

```ts
analyzed: boolean;
```

Whether this clip has been through beat analysis at all — the field that separates "never analyzed" (`false`, and `beats` empty because there is nothing) from "analyzed, found nothing" (`true`, and `beats` empty because the analyzed stretch was silent). Read off the analysis record the clip persists, not off any run bookkeeping: true when the clip holds beats, or when it holds an analyzed `window` that produced none. Every other way an analysis can come back empty — unreadable audio, or a detector run that finds no pulse — records nothing and so reads `false`, which is the honest answer: there is no analysis on this clip, and analyzing it again is the next step either way.

***

### beatCount

```ts
beatCount: number;
```

Number of entries in `beats`.

***

### beats

```ts
beats: number[];
```

Detected beat times, in seconds from the start of the clip's SOURCE file — pattern-local, not project-timeline seconds and not relative to the visible region. Ascending. The UNFILTERED detections, which is what Studio's own audio-clip editor draws: every beat the model reported, spurs included. The bar-line grid an apply derives is a spur-filtered downbeat set, and the two deliberately differ (MV.acerpc's `downbeats`) — this verb answers what a human sees on the clip.

***

### bpm?

```ts
optional bpm?: number;
```

The single estimated tempo, exactly as the clip's BPM badge computes it: the V3 octave-aware estimate, falling back to the V1 mean when V3 answers nothing. Absent when the clip has no positive estimate — which is precisely when the badge shows no number. The badge rounds it for display; this is the unrounded value.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip read, with braces.

***

### downbeatCount

```ts
downbeatCount: number;
```

Number of entries in `downbeats`.

***

### downbeats

```ts
downbeats: number[];
```

Detected downbeat times, same units and same unfiltered set as `beats`.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the clip's beat analysis (ADR 0088 §5): the detections, the window they were found in, and `analyzed` itself, so the two empty answers above cannot share a token. A change-detection token rather than a precondition. A clip's beat data IS replaced — `tempo analyze` and the automatic pass on import both land an analysis over whatever was there — but neither takes a caller's fingerprint, so there is nothing to carry this back to. What it is for is noticing: re-read and compare to learn that an analysis landed, without diffing two lists of doubles.

***

### window?

```ts
optional window?: {
  endSec: number;
  lengthSec: number;
  offsetSec: number;
};
```

The stretch of the clip's source an analysis covered, as `clip beat-content` reports it. Source seconds, like the beat times it bounds: `offsetSec` is how far into the source file the analyzed range began, so a clip analyzed from its own visible start carries the visible region's `clipPosSec` here. Present only for a clip that HAS been analyzed, which is what makes an empty answer readable: a window with no beats in it says the analysis ran and found nothing, and no window at all says none ever ran.

#### endSec

```ts
endSec: number;
```

Where the analyzed range ended (`offsetSec + lengthSec`), in seconds from the source file's start.

#### lengthSec

```ts
lengthSec: number;
```

How long the analyzed range was, in seconds.

#### offsetSec

```ts
offsetSec: number;
```

Where the analyzed range began, in seconds from the source file's start.
