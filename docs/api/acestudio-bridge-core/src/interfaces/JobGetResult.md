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

### errorCode?

```ts
optional errorCode?: string;
```

Why a job ended without a product — a short machine-readable code from the producing class's own vocabulary, e.g. `noContextAudio` from a beat analysis with nothing to analyze. Present only on a `failed` or `cancelled` job, and only where the producer named a reason: a class may fail without one, so absence means "no reason recorded", never "no failure". `lifecycle` is what says whether the job failed — read this for WHY, not WHETHER. The codes are the producing class's, not this contract's, for the same reason a result payload's keys are (ADR 0084): the ledger carries every producer's jobs and cannot own a closed set of failure reasons for all of them. Read it against `jobClass`.

***

### errorMessage?

```ts
optional errorMessage?: string;
```

A human-readable sentence for the same failure — for a log or a message to the user, never for branching. Branch on `errorCode`. Present and absent independently of `errorCode`: a producer may record a message without a code, or a code without a message.

***

### hasProgress

```ts
hasProgress: boolean;
```

Whether the producer reports a real numeric progress fraction.

***

### hint?

```ts
optional hint?: string;
```

A remedy sentence for the failure — what the caller can do about it ("narrow the selection and fire again"). Mirrors `CommandError::hint` on the refusal path: a failed *job* cannot return a CommandError, so the remedy rides the job state itself instead. Composed at the error site where the producer knows a recovery, present only when it has one. Free text — branch on `errorCode`, never on this.

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

The producing function's class id, e.g. "stem-splitter".

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
lifecycle: "succeeded" | "failed" | "queued" | "running" | "cancelled";
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
  errorCode?: string;
  errorMessage?: string;
  id: string;
  state: "streaming" | "failed" | "pending" | "settled";
}[];
```

The job's 0..N result artifacts, each settling on its own — the results this job produced. A result reached through the account-scoped history belongs to no job here; it is addressed by its id alone.

#### errorCode?

```ts
optional errorCode?: string;
```

Why this result failed — a short machine-readable code from the producing class's own vocabulary, on the same terms as the job-level `errorCode` below. Present only on a `failed` result, and only where the producer named a reason; a job-level failure stamps its reason onto every open result it fails with it.

#### errorMessage?

```ts
optional errorMessage?: string;
```

A human-readable sentence for the same failure — for a log or a message to the user, never for branching. Present and absent independently of `errorCode`.

#### id

```ts
id: string;
```

Stable result id. For a staged kit this is the server's durable `task_id:audio_id` — the same id the account-scoped history reports, so the same audio is reachable under one identity from `job results` now and from history in a later session — unless the audio's streaming notification was missed, in which case the id is a session-minted stand-in until a history read rebinds it to the durable composite. For a class whose results have no server identity (System A) it is ledger-minted and session-scoped.

#### state

```ts
state: "streaming" | "failed" | "pending" | "settled";
```

How far one result has settled. `pending` is opened but not yet producing anything; `streaming` is playable and growing in real time, which only a `streamingCapable` class ever reaches (ADR 0084); `settled` is the finished product; `failed` means this result will never produce one. `settled` and `failed` are terminal. `job place` accepts a `streaming` or a `settled` result and refuses the other two.

***

### streamingCapable

```ts
streamingCapable: boolean;
```

Whether results of this class may enter the `streaming` state.
