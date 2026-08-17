# Interface: JobGetResult

Success payload of `job get`.

## Properties

### cancelable

```ts
cancelable: boolean;
```

Whether jobs of this class can be cancelled; `job cancel` returns JOB_NOT_CANCELLABLE otherwise.

***

### delivery

```ts
delivery: "direct" | "staged";
```

Where a job's results land when they settle. `direct` = they auto-place into the project as one undo step, so nothing further is asked of the caller. `staged` = they land in the session's job history for audition, and reach the project only through `job place` (or leave it through `job discard-result`). A class declares this once, so every job of one class delivers the same way.

***

### hasProgress

```ts
hasProgress: boolean;
```

Whether the producer reports a real numeric progress fraction.

***

### id

```ts
id: string;
```

Stable job id.

***

### jobClass

```ts
jobClass: string;
```

The producing function's class id, e.g. "stem-split".

***

### launcher

```ts
launcher: "ui" | "cli" | "extension" | "agent";
```

Who launched a job. Every launcher's jobs are visible to any `job.read` caller, Studio's own UI included, so a co-composer sees who started what: `ui` is a user working in Studio, `cli` the command line, `extension` a workflow extension, `agent` an AI agent driving the surface. `job list`'s `mine` narrows the listing to `cli`.

***

### launcherLabel

```ts
launcherLabel: string;
```

Free-form launcher attribution (peer/session name); may be empty.

***

### lifecycle

```ts
lifecycle: "queued" | "running" | "succeeded" | "failed" | "cancelled";
```

A job's normalized lifecycle — the same five states whatever the producer is. `queued` is accepted but not started, `running` is in flight, and `succeeded`, `failed` and `cancelled` are terminal: a job in one of those never transitions again. A job reaches `cancelled` only through an explicit `job cancel` or the producer cancelling itself, never through a peer disconnecting.

***

### progress?

```ts
optional progress?: number;
```

Progress fraction 0..1; present only for classes that declare progress.

***

### results

```ts
results: {
  id: string;
  payload?: Record<string, unknown>;
  state: "failed" | "pending" | "streaming" | "settled";
}[];
```

The job's 0..N result children, each settling on its own.

#### id

```ts
id: string;
```

Stable result id.

#### payload?

```ts
optional payload?: Record<string, unknown>;
```

What the job produced, for a class whose product IS data rather than project content — a beat analysis, a detected key, a measured loudness. A job that answers a question answers it here; there is no second verb to fetch it with. The key set is the producing class's, not this contract's, so it is an open map: `tempo analyze-context-audio` answers the beat grid under `analysisId` / `tempoMap` / `beats` / `downbeats` / `timeSignatures`, and another class answers whatever its own product is. Read it against the `jobClass` that produced it. Present exactly when the producer attached something. Absent therefore means "no answer here" — the class does not answer with data at all, or this particular result has yet to produce one — and NOT that an analysis came back empty. A run that genuinely found nothing still answers under its own keys (a beat analysis of silence reports empty `beats` and `downbeats` arrays), so an empty answer is a populated object, never a missing field. A class whose product is project content (`delivery: staged`) carries no payload: `job place` is how its product reaches the caller.

#### state

```ts
state: "failed" | "pending" | "streaming" | "settled";
```

How far one result child has settled. `pending` is opened but not yet producing anything; `streaming` is playable and growing in real time, which only a `streamingCapable` class ever reaches (ADR 0084); `settled` is the finished product; `failed` means this child will never produce one. `settled` and `failed` are terminal. `job place` accepts a `streaming` or a `settled` result and refuses the other two.

***

### streamingCapable

```ts
streamingCapable: boolean;
```

Whether results of this class may enter the `streaming` state.
