# Interface: GenerativeStemSplitResult

Success payload of `generative stem-split`.

## Properties

### cancellable

```ts
cancellable: boolean;
```

***

### clipUuid

```ts
clipUuid: string;
```

The source clip being split.

***

### delivery

```ts
delivery: string;
```

Always "direct".

***

### jobClass

```ts
jobClass: string;
```

Always "stem-split".

***

### jobId

```ts
jobId: string;
```

***

### mode?

```ts
optional mode?: "basic" | "professional" | "advanced" | "customized";
```

Which stem set a split produces — the Stem Splitter panel's four choices. `basic` and `professional` are free; `advanced` and `customized` bill their own SKUs. That is why the mode is a parameter and never inferred: a caller choosing between them is choosing what to spend.

***

### trackUuids

```ts
trackUuids: string[];
```

The tracks created to receive the stems, in stem order, inserted below the source clip's track, as braced UUIDs. They exist already and are empty; each stem lands in its own track as the job settles.
