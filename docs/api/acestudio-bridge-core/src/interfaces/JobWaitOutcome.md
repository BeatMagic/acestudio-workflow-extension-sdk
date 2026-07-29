# Interface: JobWaitOutcome

How a bounded wait ended. The snapshot rides along either way: a wait that
expired still says where the job had got to, which is the whole reason a
timeout is an outcome here rather than a thrown error — the CLI spends an exit
code on the same distinction (`job wait`, exit 4), and ADR 0092 §5 makes it a
structured non-error for MCP.

`finished` means terminal, not successful: a job that failed or was cancelled
finished too. Read `job.lifecycle`.

## Properties

### job

```ts
readonly job: JobGetResult;
```

The job as of the poll that ended the wait.

***

### status

```ts
readonly status: "finished" | "timeout";
```

Whether the job reached a terminal lifecycle, or the wait's bound expired first.
