# Interface: ClipCreateResult

Success payload of `clip create`.

## Properties

### clipBegin

```ts
clipBegin: number;
```

Clip start on the global timeline, in ticks.

***

### clipBeginSec

```ts
clipBeginSec: number;
```

`clipBegin` in seconds.

***

### clipEnd

```ts
clipEnd: number;
```

Clip end on the global timeline, in ticks (pos + dur).

***

### clipEndSec

```ts
clipEndSec: number;
```

`clipEnd` in seconds.

***

### clipName

```ts
clipName: string;
```

Display name of the created clip (auto-generated when no name was given).

***

### clipType

```ts
clipType: string;
```

Type of the created clip, echoing `type` in its canonical spelling: `sing`, `instrument`, `genericMidi`, `marker` or `chord`. Echoed because `type` is matched case-insensitively, so this is how a caller learns the spelling the rest of the surface will report.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the created clip, with braces. Address it with `clip get`, `note add`, and the other id-taking commands.

***

### nativeUnit

```ts
nativeUnit: "second" | "tick";
```

Which unit an entity's geometry is stored in — the one value that is exact, with the other reported beside it as a conversion under the current tempo curve (ADR 0032 §2-4). Declared here because every group that reports geometry names it. It follows the entity's own anchoring, which `PatternFactory::preferredGeometryTimeUnit` is the source of truth for: media that plays at wall-clock speed is second-native, content written against the grid is tick-native.

***

### noteCount

```ts
noteCount: number;
```

Number of notes in the new clip.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the initial notes, in the clip's own note order — the order `clip note-content` reports. Empty when the clip was created without content.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, `marker`, or `chord` — the region the created clip's type lives in.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of that track in `region`. Absent together with `region` when the project cannot place the track, which is an inconsistency rather than anything a caller did.

***

### trackName

```ts
trackName: string;
```

Name of the track the clip was placed on.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track, with braces — the handle a later track write takes. Not derivable from `trackName`, which is a display string and not unique.
