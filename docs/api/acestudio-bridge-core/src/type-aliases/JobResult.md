# Type Alias: JobResult\<Result\>

```ts
type JobResult<Result> = JobResultChild & Result;
```

One of a job's result children (ADR 0084).

`Result` is the job class's declared output, which a settled child carries
alongside its id and state. It defaults to `unknown`, which adds nothing: a
handle attached by id, or one for a class that declares no output, sees the
two fields the ledger guarantees.

## Type Parameters

### Result

`Result` = `unknown`
