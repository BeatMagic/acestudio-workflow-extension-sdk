# Interface: JobWaitParams

Arguments for `job wait`.

## Properties

### any?

```ts
optional any?: boolean;
```

Return as soon as the first job finishes, instead of waiting for all. Absent waits for all of them.

***

### ids

```ts
ids: string[];
```

One or more job ids to wait on.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Maximum time to wait, in milliseconds. On the CLI this bounds the whole client-side wait (exit code 4 on expiry, the job left untouched); an MCP peer reads it as the server-side long-poll cap (ADR 0092 §5). Omitted waits indefinitely.
