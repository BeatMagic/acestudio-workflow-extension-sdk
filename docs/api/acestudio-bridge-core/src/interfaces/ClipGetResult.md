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

Clip type: Sing, Instrument, GenericMidi, Audio, or Chord.

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

Whether the clip is enabled (audible).

***

### geometry

```ts
geometry: object;
```

Clip geometry in the unit reported by usedTimeUnit: integer ticks or fractional seconds.

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

Time unit of the geometry values: 'tick', 'second', 'tick (not native)', or 'second (not native)'.
