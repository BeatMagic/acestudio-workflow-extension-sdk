# Interface: ClipAddResult

Success payload of `clip add`.

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

Custom name, or '(auto-generated)' when no name was given.

***

### clipType

```ts
clipType: string;
```

Type of the placed clip: Sing, Instrument, or GenericMidi.

***

### trackName

```ts
trackName: string;
```

Name of the track the clip was placed on.
