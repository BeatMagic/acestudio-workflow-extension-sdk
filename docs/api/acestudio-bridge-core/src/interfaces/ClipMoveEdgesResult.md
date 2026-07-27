# Interface: ClipMoveEdgesResult

Success payload of `clip move-edges`.

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

Clip type: Sing, Instrument, GenericMidi, Audio, or Chord.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the moved clip, with braces.

***

### geometry

```ts
geometry: object;
```

Updated clip geometry, always in ticks.

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
