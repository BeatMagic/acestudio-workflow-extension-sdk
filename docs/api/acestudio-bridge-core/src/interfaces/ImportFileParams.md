# Interface: ImportFileParams

Arguments for `import file`.

## Properties

### clipIn?

```ts
optional clipIn?: number;
```

Offset into the source media where the visible region starts — the head trim, in ticks. Omit to start at the beginning of the file. **Media kinds only.** Ticks are the wrong axis for this quantity and `clipInSec` is the right one: the source-media axis is not on the tempo grid (ADR 0069 §1), so a tick head trim only means anything once it is measured against the tempo where the clip lands. Kept because it shipped, and it still resolves that way.

***

### clipInSec?

```ts
optional clipInSec?: number;
```

The head trim in SECONDS — the source-media axis's own unit (ADR 0069 §1). OPTIONAL, and when present it WINS over `clipIn`. **Media kinds only.**

***

### dur?

```ts
optional dur?: number;
```

How much of the source to show, in ticks. Omit — or pass 0 — for the file's own length (its remaining length, when `clipIn` trims the head). On a media import, 0 and absent mean the same thing, which is the spelling the retired `addVideoClip` documented for both its duration arguments; a NEGATIVE value is the malformed one and is refused.

***

### durSec?

```ts
optional durSec?: number;
```

How much of the source to show, in seconds. OPTIONAL. A value ABOVE zero wins over `dur`; 0 keeps its "natural length" spelling and so falls through to `dur`, exactly as the retired `addVideoClip` resolved its own pair. A NEGATIVE value is refused. **Media kinds only.**

***

### muted?

```ts
optional muted?: boolean;
```

Place a video clip with its embedded audio silenced (the detached flag, ADR 0069). **Video only** — for every other clip type the corresponding dimension is enabled/disabled, so passing this on an audio import is an error rather than a no-op.

***

### onOccupied?

```ts
optional onOccupied?: string;
```

What to do when the target span is already occupied: `fail`, `cover` to trim the clips in the way (not video), or `relocate` to stack the clip on a new video track above (video only). **Media kinds only.** Defaults to `relocate` for video and `fail` for everything else. Placing new material wants room made, and for video the room is a track above (ADR 0069 §4, ADR 0105); an audio import has no such stacking rule, so it says so rather than guessing. On video, `fail` also declines to create the region's first track, so it is the way to say "place this only if there is already somewhere to put it".

***

### path

```ts
path: string;
```

Path to the file to import. The extension decides what kind of clip it becomes; an unsupported extension is rejected with the list of supported ones.

***

### pos?

```ts
optional pos?: number;
```

Where the clip starts on the global timeline, in project ticks. Omit for tick 0, or name the same point in seconds with `posSec`.

***

### posSec?

```ts
optional posSec?: number;
```

Where the clip starts on the global timeline, in seconds. OPTIONAL, and when present it WINS over `pos` — including at 0, which is a position like any other. That is the native-unit rule (ADR 0032 §5) rather than an exception to it: every kind this call places is second-native, so seconds is always the spelling that needs no conversion. Both units are carried because a video peer thinks in seconds while the timeline is native in ticks, and converting between them needs the tempo curve. The CLI's time-value grammar (`1.5s`) is not this: it compiles to ticks client-side, so it leaves an SDK caller with a `convert time-to-tick` round trip on a placement path. **Media kinds only.**

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default) or `video`. The regions are isolated index spaces (ADR 0104), so an index read against the wrong one names an unrelated track (ADR 0129 §1). The region has to match the kind being imported, and a mismatch is refused rather than ignored: a video file lands in the `video` region and nothing else lands there, so `region: "arrangement"` on a video import names a track that cannot hold it.

***

### splitPolyphonic?

```ts
optional splitPolyphonic?: boolean;
```

Split polyphonic content into separate monophonic voices, one track each. **MIDI and MusicXML only** — the desktop app asks this in a dialog; here it is an argument, defaulting to off (one track per source track).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

Target track position (0-based) in `region`. Mutually exclusive with `trackUuid`. An `Empty` arrangement slot is a valid target and is converted in place.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Target track UUID in braces format. The definitive handle: it names a track in every region, where an index needs `region` to be read — so this is the form that reaches a video layer with nothing else to get right. Omit the addressing form entirely to auto-route: a media or foreign-project import lands on a new track after the existing content, and a video import lands on the region's head track — local index 0, the topmost layer and the one the monitor shows.

***

### withTempo?

```ts
optional withTempo?: boolean;
```

Adopt the source file's tempo map, replacing the project's over the imported range. **Foreign-project kinds only**, and off by default: rewriting someone's tempo is not a side effect of "import these notes".

***

### withTimeSignatures?

```ts
optional withTimeSignatures?: boolean;
```

Adopt the source file's time signatures. **Foreign-project kinds only**, off by default, same reasoning as `withTempo`.
