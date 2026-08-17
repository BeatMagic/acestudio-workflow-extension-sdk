# Interface: TempoAnalyzeResult

Success payload of `tempo analyze`.

## Properties

### analysisId

```ts
analysisId: string;
```

The id the finished analysis will be filed under — known up front, so a caller can line up its `tempo apply-beat-analysis` before the job settles. Valid only once the job reaches `succeeded`; a failed or cancelled run files nothing and `tempo apply-beat-analysis` answers NOT_FOUND.

***

### jobClassId

```ts
jobClassId: "tempo-analyze";
```

The job class `tempo analyze` files its work under, for a consumer keying off the producing function rather than off the individual job. `tempo analyze` launches exactly one kind of job, so the roster holds one value.

***

### jobId

```ts
jobId: string;
```

The launched job's id, returned before any analysis runs. Observe it with `job get` / `job wait`, stop it with `job cancel`.
