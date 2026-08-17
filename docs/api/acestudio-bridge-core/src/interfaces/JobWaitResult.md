# Interface: JobWaitResult

Success payload of `job wait`.

## Properties

### done

```ts
done: boolean;
```

Whether the wait condition (all ids, or with `any` set, any one id) is met. The CLI keeps polling while false.

***

### finished

```ts
finished: string[];
```

Ids of the waited-on jobs that have reached a terminal lifecycle.

***

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
     payload?: Record<string, unknown>;
     state: "failed" | "pending" | "streaming" | "settled";
  }[];
  streamingCapable: boolean;
}[];
```

Current snapshot of each waited-on job.

#### cancelable

```ts
cancelable: boolean;
```

Whether jobs of this class can be cancelled; `job cancel` returns JOB_NOT_CANCELLABLE otherwise.

#### delivery

```ts
delivery: "direct" | "staged";
```

Where a job's results land when they settle. `direct` = they auto-place into the project as one undo step, so nothing further is asked of the caller. `staged` = they land in the session's job history for audition, and reach the project only through `job place` (or leave it through `job discard-result`). A class declares this once, so every job of one class delivers the same way.

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

Who launched a job. Every launcher's jobs are visible to any `job.read` caller, Studio's own UI included, so a co-composer sees who started what: `ui` is a user working in Studio, `cli` the command line, `extension` a workflow extension, `agent` an AI agent driving the surface. `job list`'s `mine` narrows the listing to `cli`.

#### launcherLabel

```ts
launcherLabel: string;
```

Free-form launcher attribution (peer/session name); may be empty.

#### lifecycle

```ts
lifecycle: "queued" | "running" | "succeeded" | "failed" | "cancelled";
```

A job's normalized lifecycle — the same five states whatever the producer is. `queued` is accepted but not started, `running` is in flight, and `succeeded`, `failed` and `cancelled` are terminal: a job in one of those never transitions again. A job reaches `cancelled` only through an explicit `job cancel` or the producer cancelling itself, never through a peer disconnecting.

#### progress?

```ts
optional progress?: number;
```

Progress fraction 0..1; present only for classes that declare progress.

#### results

```ts
results: {
  id: string;
  payload?: Record<string, unknown>;
  state: "failed" | "pending" | "streaming" | "settled";
}[];
```

The job's 0..N result children, each settling on its own.

#### streamingCapable

```ts
streamingCapable: boolean;
```

Whether results of this class may enter the `streaming` state.
