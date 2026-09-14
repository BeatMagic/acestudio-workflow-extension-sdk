# Interface: JobResultsResult

Success payload of `job results`.

## Properties

### results

```ts
results: {
  errorCode?: string;
  errorMessage?: string;
  id: string;
  state: "streaming" | "failed" | "pending" | "settled";
}[];
```

The job's results.

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
