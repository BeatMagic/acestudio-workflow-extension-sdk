# Interface: SoundSourceLoadResult

Success payload of `sound-source load`.

## Properties

### format?

```ts
optional format?: string;
```

Which plugin format was mounted (`vst3`, `vst2`, `au`). Always reported for an external instrument, including when it was defaulted rather than requested, so a caller knows what it actually got.

***

### kind

```ts
kind: "voice" | "choir" | "instrument" | "ensemble" | "external-instrument";
```

What a sound source is — the roster every `kind` takes, whether it filters a listing or reports what a row turned out to be. A track carries exactly one kind at a time, and loading a source of another kind converts the track to suit it.

***

### language?

```ts
optional language?: string;
```

Full English name of the track's default note language. Emitted only when the load created the track's language, which happens when a MIDI or Empty track becomes a Sing track.

***

### modelName?

```ts
optional modelName?: string;
```

The vocal synth model the source sings through. Voices and choirs only.

***

### name

```ts
name: string;
```

Display name of that source.

***

### ref

```ts
ref: string;
```

Ref of the source that landed, resolved from `source`.

***

### region

```ts
region: string;
```

Which index space `trackIndex` counts in: `arrangement`, the only region whose tracks this group reaches. Written out rather than implied, so a caller reading a track index anywhere on this surface reads it the same way and needs no table of which groups omit it (ADR 0129 §2).

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track loaded onto.

***

### trackType

```ts
trackType: string;
```

What the track ended up as. Loading a voice onto a MIDI track converts it to `Sing`.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.

***

### vendor?

```ts
optional vendor?: string;
```

Plugin vendor. External instruments only.
