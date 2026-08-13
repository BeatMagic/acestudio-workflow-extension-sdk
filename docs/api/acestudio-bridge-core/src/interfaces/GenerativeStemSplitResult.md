# Interface: GenerativeStemSplitResult

Success payload of `generative stem-split`.

## Properties

### cancellable

```ts
cancellable: boolean;
```

Whether `job cancel` will be honored for this job. False means a cancel returns JOB_NOT_CANCELLABLE rather than pretending -- the server-side kits (song, enhance) have no in-flight cancel.

***

### clipUuid

```ts
clipUuid: string;
```

The source clip being split.

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

### mode?

```ts
optional mode?: string;
```

The split that was launched: 'basic', 'professional', 'advanced' or 'customized'.

***

### trackIds

```ts
trackIds: string[];
```

The tracks created to receive the stems, in stem order, inserted below the source clip's track. They exist already and are empty; each stem lands in its own track as the job settles.
