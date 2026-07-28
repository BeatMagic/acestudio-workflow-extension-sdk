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

Type of the placed clip: `sing`, `instrument`, or `genericMidi`.

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

UUIDs of the initial notes, in the clip's own note order — the order `clip note-content` reports, which is not necessarily the order they were given in. Empty when the clip was created without content.

***

### trackName

```ts
trackName: string;
```

Name of the track the clip was placed on.
