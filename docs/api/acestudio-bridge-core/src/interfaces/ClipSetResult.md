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
  clipBegin: number;
  clipDur: number;
  clipEnd: number;
  clipPos: number;
  dur: number;
  end: number;
  pos: number;
};
```

Clip geometry, always in ticks.

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

True when the clip follows its track's color instead of carrying its own.

***

### rawName

```ts
rawName: string;
```

The custom name as stored. Empty when the clip falls back to an auto-generated name.
