# Interface: GenerativeSoundEffectsResult

Success payload of `generative sound-effects`.

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

### from?

```ts
optional from?: number;
```

Tick position the placed clip will start at.

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

### to?

```ts
optional to?: number;
```

Tick position the placed clip will end at (exclusive).

***

### trackId

```ts
trackId: string;
```

The track the result will be placed on, resolved at launch. For a command that creates its own target track, this is the created track's id -- it exists already, empty, and the clip lands in it when the job settles.
