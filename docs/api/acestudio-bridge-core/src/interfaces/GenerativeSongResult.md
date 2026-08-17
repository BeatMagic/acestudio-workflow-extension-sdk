# Interface: GenerativeSongResult

Success payload of `generative song`.

## Properties

### cancellable

```ts
cancellable: boolean;
```

Whether `job cancel` will be honored. Always false for these two: the server-side kits have no in-flight cancel.

***

### delivery

```ts
delivery: string;
```

How this class delivers results. Always "staged" here: results land in the session history for audition and reach the project only through `job place`.

***

### jobClass

```ts
jobClass: string;
```

The job class, as `job get` reports it and `job list` filters on: "song-generate" or "music-enhance".

***

### jobId

```ts
jobId: string;
```

The launched job's id. Present on every successful launch — nothing has been generated when this returns.

***

### streamingCapable?

```ts
optional streamingCapable?: boolean;
```

True when results of this class can enter the `streaming` state — playable while still growing, and placeable before they settle. Both staged kits are streaming-capable.
