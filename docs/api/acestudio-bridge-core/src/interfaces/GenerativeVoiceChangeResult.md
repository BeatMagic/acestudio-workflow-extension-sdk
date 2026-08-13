# Interface: GenerativeVoiceChangeResult

Success payload of `generative voice-change`.

## Properties

### cancellable

```ts
cancellable: boolean;
```

Whether `job cancel` will be honored for this job. False means a cancel returns JOB_NOT_CANCELLABLE rather than pretending -- the server-side kits (song, enhance) have no in-flight cancel.

***

### delivery

```ts
delivery: string;
```

How this class delivers results: 'staged' means they land in the session history for audition and reach the project only through `job place`; 'direct' means they auto-place as one attributed undo entry. See `help streaming-results`.

***

### jobClass

```ts
jobClass: string;
```

The job class, as `job get` reports it and `job list` can be filtered on: 'song-generate', 'music-enhance', 'text2sample', 'seed-audio', 'sound-effects', 'add-a-layer', 'stem-split', 'voice-changer' or 'vocal2midi'.

***

### jobId

```ts
jobId: string;
```

The launched job's id. Pass it to `job get` / `job wait` / `job results`. Present on every successful launch -- nothing has been generated when this returns.

***

### modelIds

```ts
modelIds: number[];
```

The Voice Changer models being generated, in the order given. One job result per model, each settling on its own.

***

### trackIds

```ts
trackIds: string[];
```

The tracks created to receive each converted take, index-aligned with `modelIds`.
