# Interface: JobWaitParams

Arguments for `job wait`.

## Properties

### any

```ts
any: boolean;
```

Return as soon as the first job finishes, instead of waiting for all.

***

### ids

```ts
ids: string[];
```

One or more job ids to wait on.

***

### timeoutMs?

```ts
optional timeoutMs?: number | null;
```

Maximum time to wait, e.g. `30s`, `500ms`, `5m`, `1h`. On expiry the CLI exits with code 4 and never cancels the job. Omit to wait indefinitely.
