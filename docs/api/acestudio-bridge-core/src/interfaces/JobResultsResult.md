# Interface: JobResultsResult

Success payload of `job results`.

## Properties

### results

```ts
results: object[];
```

The job's result children.

#### id

```ts
id: string;
```

#### state

```ts
state: "failed" | "pending" | "streaming" | "settled";
```

Result state; `streaming` = playable and growing in real time (ADR 0084).
