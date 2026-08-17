# Interface: JobListParams

Arguments for `job list`.

## Properties

### mine?

```ts
optional mine?: boolean;
```

Show only jobs whose launcher is the CLI, not UI / extension / agent.

***

### running?

```ts
optional running?: boolean;
```

Show only jobs that are still running (not yet terminal).
