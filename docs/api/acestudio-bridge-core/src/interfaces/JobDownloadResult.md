# Interface: JobDownloadResult

Success payload of `job download`.

## Properties

### jobId

```ts
jobId: string;
```

The download job's id. Watch it like any other work: `job wait` blocks, `job get` reports progress (0..1), `job cancel` stops it.

***

### resultId

```ts
resultId: string;
```

The result being fetched — the id the caller passed, so one reply names both sides of the fetch.
