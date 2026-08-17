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
clips: {
  clipBegin: number;
  clipColor: string;
  clipEnd: number;
  clipName: string;
  clipType: string;
  clipUuid: string;
  enabled: boolean;
  noteCount?: number;
}[];
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

Clip type: `sing`, `instrument`, `genericMidi`, `audio`, `chord`, `video`, or `marker`.

#### clipUuid

```ts
clipUuid: string;
```

Stable clip UUID, with braces. Every id-taking clip write takes it — `clip move`, `clip resize`, `clip delete`.

#### enabled

```ts
enabled: boolean;
```

Whether the clip is enabled. A disabled clip is skipped at playback and export; an enabled one still goes silent under a track mute or another track's solo, so this is the clip's own switch, not final audibility. Reported per row so a caller learns which clips are live from the same call that enumerates them, rather than one `clip get` per clip. That matters for the question this answers most often: whether any MIDI-like track holds an enabled clip, which decides whether a tempo sync would de-align content that owns the current grid. Mute is a different question and does not appear here — muted content still owns the grid.

#### noteCount?

```ts
optional noteCount?: number;
```

Visible note count. Present only for note-based clips (Sing/Instrument/GenericMidi); absent for Audio and Chord.
