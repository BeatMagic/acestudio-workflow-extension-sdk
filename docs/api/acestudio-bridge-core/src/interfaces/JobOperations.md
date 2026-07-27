# Interface: JobOperations

The `job` operations, mirroring the canonical operation tree 1:1.

## Methods

### cancel()

```ts
cancel(params, options?): Promise<void>;
```

Cancel a job (honest per-class cancelability).

Requires the `job.control` capability.

#### Parameters

##### params

[`JobCancelParams`](JobCancelParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### discardResult()

```ts
discardResult(params, options?): Promise<void>;
```

Discard a staged result from session history (project untouched).

Requires the `job.control` capability.

#### Parameters

##### params

[`JobDiscardResultParams`](JobDiscardResultParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### get()

```ts
get(params, options?): Promise<JobGetResult>;
```

Show one job with its result children and states.

Requires the `job.read` capability.

#### Parameters

##### params

[`JobGetParams`](JobGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`JobGetResult`](JobGetResult.md)\>

***

### list()

```ts
list(params, options?): Promise<JobListResult>;
```

List the project session's jobs with launcher attribution.

Requires the `job.read` capability.

#### Parameters

##### params

[`JobListParams`](JobListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`JobListResult`](JobListResult.md)\>

***

### place()

```ts
place(params, options?): Promise<JobPlaceResult>;
```

Place a staged result onto a track as one undo entry.

Requires the `clip.write` capability.

#### Parameters

##### params

[`JobPlaceParams`](JobPlaceParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`JobPlaceResult`](JobPlaceResult.md)\>

***

### results()

```ts
results(params, options?): Promise<JobResultsResult>;
```

List a job's result children and their settling states.

Requires the `job.read` capability.

#### Parameters

##### params

[`JobResultsParams`](JobResultsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`JobResultsResult`](JobResultsResult.md)\>

***

### wait()

```ts
wait(params, options?): Promise<JobWaitResult>;
```

Wait for one or more jobs to finish (progress on stderr).

Requires the `job.read` capability.

#### Parameters

##### params

[`JobWaitParams`](JobWaitParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`JobWaitResult`](JobWaitResult.md)\>
