# Interface: ClipListResult

Success payload of `clip list`.

## Properties

### clipCount

```ts
clipCount: number;
```

Number of clips returned.

***

### clips

```ts
clips: object[];
```

Clips on the track, in track order.

#### clipBegin

```ts
clipBegin: number;
```

Visible region start on the global timeline, in ticks.

#### clipColor

```ts
clipColor: string;
```

Resolved hex color, upper-case with leading '#'.

#### clipEnd

```ts
clipEnd: number;
```

Visible region end on the global timeline, in ticks.

#### clipName

```ts
clipName: string;
```

Display name (auto-generated when no raw name is set).

#### clipType

```ts
clipType: string;
```

Clip type: Sing, Instrument, GenericMidi, Audio, or Chord.

#### clipUuid

```ts
clipUuid: string;
```

Stable clip UUID, with braces. Use with `clip move-edges`.

#### noteCount?

```ts
optional noteCount?: number;
```

Visible note count. Present only for note-based clips (Sing/Instrument/GenericMidi); absent for Audio and Chord.
