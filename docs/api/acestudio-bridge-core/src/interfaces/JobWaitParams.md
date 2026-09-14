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

Maximum time to wait, in milliseconds. Expiry never cancels anything, on either surface: the jobs keep running and `job cancel` remains the only thing that stops one. What an expiry *is*, and what omitting this means, differ by surface (ADR 0092 §5). On the CLI this bounds the whole client-side wait, which exits with code 4 when it runs out, and omitting it waits indefinitely. Over MCP it is the budget for one long-poll call, clamped down to a server-side cap, and an expiry is a *success* answering `done: false` rather than an error — so omitting it takes the server's default instead of waiting forever, because an MCP call that never returns reads as a hang under the per-call timeouts clients enforce.
