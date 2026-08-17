# Interface: ClipGetResult

Success payload of `clip get`.

## Properties

### clipName

```ts
clipName: string;
```

Display name (auto-generated when no raw name is set).

***

### clipType

```ts
clipType: string;
```

Clip type: `sing`, `instrument`, `genericMidi`, `audio`, `chord`, `video`, or `marker` — the same vocabulary `clip list` reports.

***

### clipUuid

```ts
clipUuid: string;
```

Stable clip UUID, with braces.

***

### color

```ts
color: string;
```

Resolved hex color, upper-case with leading '#'.

***

### enabled

```ts
enabled: boolean;
```

Whether the clip is enabled. The clip's own switch: a disabled clip is skipped at playback and export, and an enabled one still goes silent under a track mute or another track's solo.

***

### geometry

```ts
geometry: {
  clipBegin: number;
  clipDur: number;
  clipEnd: number;
  clipPos: number;
  dur: number;
  end: number;
  pos: number;
};
```

A clip's geometry in the *entity* vocabulary, as `clip get` reports it, in whichever unit `usedTimeUnit` names. `pos`/`dur`/`end` are the whole editable region — for a media clip, its source — and the visible region is the four `clip*` fields. A write reports [`ClipWriteGeometry`] instead, which names the visible region a write's own arguments address.

#### clipBegin

```ts
clipBegin: number;
```

Visible region start on the global timeline.

#### clipDur

```ts
clipDur: number;
```

Duration of the visible (clipped) region.

#### clipEnd

```ts
clipEnd: number;
```

Visible region end on the global timeline.

#### clipPos

```ts
clipPos: number;
```

Start of the visible (clipped) region, pattern-local.

#### dur

```ts
dur: number;
```

Full pattern duration, including trimmed-away regions.

#### end

```ts
end: number;
```

Pattern end on the global timeline (pos + dur).

#### pos

```ts
pos: number;
```

Pattern start on the global timeline.

***

### isColorLinkToTrack

```ts
isColorLinkToTrack: boolean;
```

Whether the clip color follows the track color.

***

### rawName

```ts
rawName: string;
```

User-supplied name; empty string when the display name is auto-generated.

***

### usedTimeUnit

```ts
usedTimeUnit: string;
```

Time unit of the geometry values: `tick`, `second`, `tick (not native)`, or `second (not native)`.
