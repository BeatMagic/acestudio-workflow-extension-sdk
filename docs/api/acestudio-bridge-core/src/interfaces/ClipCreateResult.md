# Interface: ClipCreateResult

Success payload of `clip create`.

## Properties

### clipBegin

```ts
clipBegin: number;
```

Clip start on the global timeline, in ticks.

***

### clipEnd

```ts
clipEnd: number;
```

Clip end on the global timeline, in ticks (pos + dur).

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

### trackName

```ts
trackName: string;
```

Name of the track the clip was placed on.
