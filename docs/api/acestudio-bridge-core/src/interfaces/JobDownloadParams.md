# Interface: JobDownloadParams

Arguments for `job download`.

## Properties

### resultId

```ts
resultId: string;
```

The result whose audio to fetch, from `job results` or the account-scoped generated-results history. Must be settled — a still-streaming result has no finished audio to fetch.
