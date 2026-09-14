# Interface: JobResultsParams

Arguments for `job results`.

## Properties

### id

```ts
id: string;
```

The job id whose result artifacts to list. A result read from the account-scoped history has no job in this session, so it is addressed by result id alone (`job place`), never through this verb.
