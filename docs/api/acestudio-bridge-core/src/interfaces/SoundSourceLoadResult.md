# Interface: SoundSourceLoadResult

Success payload of `sound-source load`.

## Properties

### format?

```ts
optional format?: "vst3" | "vst2" | "au";
```

Which plugin format was mounted. Always reported for an external instrument, including when it was defaulted rather than requested, so a caller knows what it actually got.

***

### kind

```ts
kind: "voice" | "choir" | "instrument" | "ensemble" | "external-instrument";
```

What kind of source landed.

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

Ref of the source that landed, resolved from `--source`.

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

What the track ended up as. Loading a voice onto a MIDI track converts it to 'Sing'.

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
