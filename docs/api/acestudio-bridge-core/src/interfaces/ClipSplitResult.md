# Interface: ClipSplitResult

Success payload of `clip split`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

The two halves, head first. The head keeps the original UUID.

***

### head

```ts
head: {
  clipName: string;
  clipType: string;
  clipUuid: string;
  geometry: {
     clipBegin: number;
     clipDur: number;
     clipEnd: number;
     clipPos: number;
     dur: number;
     end: number;
     pos: number;
  };
};
```

The earlier half, which reuses the original clip.

#### clipName

```ts
clipName: string;
```

Display name of the clip.

#### clipType

```ts
clipType: string;
```

Clip type: `sing`, `instrument`, `genericMidi`, `audio`, `video`, `chord`, or `marker`.

#### clipUuid

```ts
clipUuid: string;
```

UUID of the clip, with braces.

#### geometry

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

Clip geometry after the write, always in ticks.

##### geometry.clipBegin

```ts
clipBegin: number;
```

Visible region start on the global timeline.

##### geometry.clipDur

```ts
clipDur: number;
```

Duration of the visible (clipped) region.

##### geometry.clipEnd

```ts
clipEnd: number;
```

Visible region end on the global timeline.

##### geometry.clipPos

```ts
clipPos: number;
```

Start of the visible (clipped) region, pattern-local.

##### geometry.dur

```ts
dur: number;
```

Full pattern duration, including trimmed-away regions.

##### geometry.end

```ts
end: number;
```

Pattern end on the global timeline (pos + dur).

##### geometry.pos

```ts
pos: number;
```

Pattern start on the global timeline.

***

### tail

```ts
tail: {
  clipName: string;
  clipType: string;
  clipUuid: string;
  geometry: {
     clipBegin: number;
     clipDur: number;
     clipEnd: number;
     clipPos: number;
     dur: number;
     end: number;
     pos: number;
  };
};
```

The later half, a new clip over the same source.

#### clipName

```ts
clipName: string;
```

Display name of the clip.

#### clipType

```ts
clipType: string;
```

Clip type: `sing`, `instrument`, `genericMidi`, `audio`, `video`, `chord`, or `marker`.

#### clipUuid

```ts
clipUuid: string;
```

UUID of the clip, with braces.

#### geometry

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

Clip geometry after the write, always in ticks.

##### geometry.clipBegin

```ts
clipBegin: number;
```

Visible region start on the global timeline.

##### geometry.clipDur

```ts
clipDur: number;
```

Duration of the visible (clipped) region.

##### geometry.clipEnd

```ts
clipEnd: number;
```

Visible region end on the global timeline.

##### geometry.clipPos

```ts
clipPos: number;
```

Start of the visible (clipped) region, pattern-local.

##### geometry.dur

```ts
dur: number;
```

Full pattern duration, including trimmed-away regions.

##### geometry.end

```ts
end: number;
```

Pattern end on the global timeline (pos + dur).

##### geometry.pos

```ts
pos: number;
```

Pattern start on the global timeline.
