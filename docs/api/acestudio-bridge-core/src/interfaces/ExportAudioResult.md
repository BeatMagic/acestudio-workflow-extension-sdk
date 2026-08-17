# Interface: ExportAudioResult

Success payload of `export audio`.

## Properties

### cancellable?

```ts
optional cancellable?: boolean;
```

Whether `job cancel` will be honored for this job.

***

### jobClass?

```ts
optional jobClass?: string;
```

The job class, as `job get` reports it: always "export-audio".

***

### jobId

```ts
jobId: string;
```

The launched job's id. Pass it to `job get` / `job wait` / `job cancel`.

***

### paths

```ts
paths: string[];
```

Every file the render will write, resolved at launch. One entry for "master"; one per exported track for the per-track scopes. These files do not exist yet — wait on the job before reading them.

***

### scope?

```ts
optional scope?: "master" | "selected-tracks" | "all-tracks" | "tracks";
```

What an `export audio` call renders. Omitted on the way in it falls back to `master`, the Export dialog's own default; the launch result reports the value it resolved to, so a caller can always see which one ran.

***

### trackCount?

```ts
optional trackCount?: number;
```

How many tracks the render covers. Per-track scopes only; absent for "master".
