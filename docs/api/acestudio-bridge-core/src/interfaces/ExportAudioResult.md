# Interface: ExportAudioResult

Success payload of `export audio`.

## Properties

### cancellable?

```ts
optional cancellable?: boolean;
```

Whether `job cancel` will be honored for this job. False means a cancel returns JOB_NOT_CANCELLABLE rather than pretending.

***

### jobClass?

```ts
optional jobClass?: string;
```

The job class, as `job get` reports it: 'export-audio' or 'export-video'.

***

### jobId

```ts
jobId: string;
```

The launched job's id. Pass it to `job get` / `job wait` / `job cancel`. Present on every successful launch -- the render has NOT finished when this returns.

***

### paths

```ts
paths: string[];
```

Every file the render will write, resolved at launch. One entry for 'master'; one per exported track for the per-track scopes, already de-duplicated the way the Export dialog de-duplicates colliding track names. These files do not exist yet -- wait on the job before reading them.

***

### scope?

```ts
optional scope?: string;
```

The scope that was launched: 'master', 'selected-tracks', 'all-tracks' or 'tracks'.

***

### trackCount?

```ts
optional trackCount?: number;
```

How many tracks the render covers. Per-track scopes only; absent for 'master'.
