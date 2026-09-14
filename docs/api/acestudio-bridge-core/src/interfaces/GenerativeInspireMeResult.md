# Interface: GenerativeInspireMeResult

Success payload of `generative inspire-me`.

## Properties

### cancellable

```ts
cancellable: boolean;
```

Whether `job cancel` will be honored. Always false here: the server-side kit has no in-flight cancel.

***

### delivery

```ts
delivery: string;
```

How this class delivers results. Always "staged" here: results land in the session history for audition and reach the project only through `job place`.

***

### jobClass

```ts
jobClass: string;
```

The job class, as `job get` reports it and `job list` filters on: "inspire-me".

***

### jobId

```ts
jobId: string;
```

The launched job's id. Present on every successful launch — nothing has been generated when this returns.

***

### streamingCapable?

```ts
optional streamingCapable?: boolean;
```

True when results of this class can enter the `streaming` state — playable while still growing, and placeable before they settle.
