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
  clipBegin: number;
  clipDur: number;
  clipEnd: number;
  clipPos: number;
  dur: number;
  end: number;
  pos: number;
};
```

Geometry of the copy, always in ticks.

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
