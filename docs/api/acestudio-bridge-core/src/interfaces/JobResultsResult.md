# Interface: JobResultsResult

Success payload of `job results`.

## Properties

### results

```ts
results: {
  id: string;
  payload?: Record<string, unknown>;
  state: "failed" | "pending" | "streaming" | "settled";
}[];
```

The job's result children.

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
