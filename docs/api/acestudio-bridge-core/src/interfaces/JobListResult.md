# Interface: JobListResult

Success payload of `job list`.

## Properties

### jobs

```ts
jobs: {
  cancelable: boolean;
  delivery: "direct" | "staged";
  errorCode?: string;
  errorMessage?: string;
  hasProgress: boolean;
  hint?: string;
  id: string;
  jobClass: string;
  launcher: "ui" | "cli" | "extension" | "agent";
  launcherLabel: string;
  lifecycle: "succeeded" | "failed" | "queued" | "running" | "cancelled";
  progress?: number;
  results: {
     errorCode?: string;
     errorMessage?: string;
     id: string;
     state: "streaming" | "failed" | "pending" | "settled";
  }[];
  streamingCapable: boolean;
}[];
```

The current project session's jobs, newest last — the work this session performed, from every launcher. This is a job listing, not an inventory of every result the caller can reach: reading the account-scoped generated-results history adds nothing here, because a history result has no job and reaching it invents none.

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

#### errorCode?

```ts
optional errorCode?: string;
```

Why a job ended without a product — a short machine-readable code from the producing class's own vocabulary, e.g. `noContextAudio` from a beat analysis with nothing to analyze. Present only on a `failed` or `cancelled` job, and only where the producer named a reason: a class may fail without one, so absence means "no reason recorded", never "no failure". `lifecycle` is what says whether the job failed — read this for WHY, not WHETHER. The codes are the producing class's, not this contract's, for the same reason a result payload's keys are (ADR 0084): the ledger carries every producer's jobs and cannot own a closed set of failure reasons for all of them. Read it against `jobClass`.

#### errorMessage?

```ts
optional errorMessage?: string;
```

A human-readable sentence for the same failure — for a log or a message to the user, never for branching. Branch on `errorCode`. Present and absent independently of `errorCode`: a producer may record a message without a code, or a code without a message.

#### hasProgress

```ts
hasProgress: boolean;
```

Whether the producer reports a real numeric progress fraction.

#### hint?

```ts
optional hint?: string;
```

A remedy sentence for the failure — what the caller can do about it ("narrow the selection and fire again"). Mirrors `CommandError::hint` on the refusal path: a failed *job* cannot return a CommandError, so the remedy rides the job state itself instead. Composed at the error site where the producer knows a recovery, present only when it has one. Free text — branch on `errorCode`, never on this.

#### id

```ts
id: string;
```

Stable job id.

#### jobClass

```ts
jobClass: string;
```

The producing function's class id, e.g. "stem-splitter".

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
lifecycle: "succeeded" | "failed" | "queued" | "running" | "cancelled";
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
  errorCode?: string;
  errorMessage?: string;
  id: string;
  state: "streaming" | "failed" | "pending" | "settled";
}[];
```

The job's 0..N result artifacts, each settling on its own — the results this job produced. A result reached through the account-scoped history belongs to no job here; it is addressed by its id alone.

#### streamingCapable

```ts
streamingCapable: boolean;
```

Whether results of this class may enter the `streaming` state.
