# Interface: GenerativeText2sampleResult

Success payload of `generative text2sample`.

## Properties

### cancellable

```ts
cancellable: boolean;
```

Whether `job cancel` will be honored for this job.

***

### delivery

```ts
delivery: string;
```

How this class delivers results. Always "direct" here: the result auto-places as one attributed undo entry.

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

The job class: "text2sample", "seed-audio", "sound-effects", "add-a-layer" or "vocal2midi".

***

### jobId

```ts
jobId: string;
```

The launched job's id.

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

The track the result will be placed on, resolved at launch. For a command that creates its own target track, this is the created track's id — it exists already, empty, and the clip lands in it when the job settles.
