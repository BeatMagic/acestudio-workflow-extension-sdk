# Interface: GenerativeSongResult

Success payload of `generative song`.

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

### streamingCapable?

```ts
optional streamingCapable?: boolean;
```

True when this class's results can enter the `streaming` state -- playable while still growing, and placeable before they settle. Both staged kits are streaming-capable.
