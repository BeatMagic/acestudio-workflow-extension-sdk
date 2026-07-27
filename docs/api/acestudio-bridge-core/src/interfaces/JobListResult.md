# Interface: JobListResult

Success payload of `job list`.

## Properties

### jobs

```ts
jobs: {
  cancelable: boolean;
  delivery: "direct" | "staged";
  hasProgress: boolean;
  id: string;
  jobClass: string;
  launcher: "ui" | "cli" | "extension" | "agent";
  launcherLabel: string;
  lifecycle: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  progress?: number;
  results: {
     id: string;
     state: "failed" | "pending" | "streaming" | "settled";
  }[];
  streamingCapable: boolean;
}[];
```

The current project session's jobs, newest last.

#### cancelable

```ts
cancelable: boolean;
```

Whether jobs of this class can be cancelled; `job cancel` returns JOB_NOT_CANCELLABLE otherwise.

#### delivery

```ts
delivery: "direct" | "staged";
```

direct = results auto-place into the project; staged = results land in session history for `job place`.

#### hasProgress

```ts
hasProgress: boolean;
```

Whether the producer reports a real numeric progress fraction.

#### id

```ts
id: string;
```

Stable job id.

#### jobClass

```ts
jobClass: string;
```

The producing function's class id, e.g. "stem-split".

#### launcher

```ts
launcher: "ui" | "cli" | "extension" | "agent";
```

Who launched the job.

#### launcherLabel

```ts
launcherLabel: string;
```

Free-form launcher attribution (peer/session name); may be empty.

#### lifecycle

```ts
lifecycle: "queued" | "running" | "succeeded" | "failed" | "cancelled";
```

Normalized job lifecycle; succeeded/failed/cancelled are terminal.

#### progress?

```ts
optional progress?: number;
```

Progress fraction 0..1; present only for classes that declare progress.

#### results

```ts
results: {
  id: string;
  state: "failed" | "pending" | "streaming" | "settled";
}[];
```

The job's 0..N result children, each settling on its own.

#### streamingCapable

```ts
streamingCapable: boolean;
```

Whether results of this class may enter the `streaming` state.
