# Interface: JobHandle\<Result\>

A handle on one job in the ledger.

`Result` is the job class's declared output, which its result children carry
once they settle. It is `unknown` for a handle attached by id, since an id
alone does not say what class the job is.

## Type Parameters

### Result

`Result` = `unknown`

## Properties

### id

```ts
readonly id: string;
```

The ledger's stable id for this job — what `client.job.*` takes.

## Methods

### cancel()

```ts
cancel(options?): Promise<void>;
```

Ask the ledger to stop the job.

Cancelability is declared per job class and reported honestly: a class that
cannot be stopped answers rather than pretending, and this passes that
answer on rather than guessing locally.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

#### Throws

BridgeError with code `JOB_NOT_CANCELLABLE` for a class that does
not cancel, or `CAPABILITY_DENIED` without `job.control`.

***

### onProgress()

```ts
onProgress(listener): Unsubscribe;
```

Watch the job: the listener is handed a fresh snapshot every time the ledger
reports this job moved, until the returned [Unsubscribe](../type-aliases/Unsubscribe.md) is called.

A change notification is a hint to re-read rather than the new state (ADR
0083 §2.4), so each hint costs one `job get` and the listener sees the
answer. Progress is a real fraction only where the class declares one
(`hasProgress`); otherwise a snapshot is the lifecycle and result states
moving, which is what there is to report.

A re-read that fails is logged rather than delivered — the listener takes
snapshots, and there is no honest snapshot to hand it — and the subscription
survives, so the next change reads again. Watch `connection.onClose` for the
one failure that ends it.

#### Parameters

##### listener

(`job`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Throws

BridgeError with code `CAPABILITY_DENIED` if the grant cannot read
the ledger — raised here rather than leaving a listener that never fires.

***

### result()

```ts
result(options?): Promise<readonly JobResult<Result>[]>;
```

The job's result children, each with its own settling state.

This is the retrieval step `staged` delivery exists for: results land in
session history rather than in the project, and putting one somewhere is a
separate `client.job.place` the caller makes when it has decided where
(ADR 0084). A `direct`-delivery class places its own results, so calling
this on one reports what was placed rather than offering anything to place.

A job carries 0..N of them — a single clip, a stem splitter's several, a
song generator's progressively-settling two.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<readonly [`JobResult`](../type-aliases/JobResult.md)\<`Result`\>[]\>

***

### wait()

```ts
wait(options?): Promise<JobWaitOutcome>;
```

Wait for the job to reach a terminal lifecycle, bounded by `options`.

The waiting is explicit and it only observes: nothing here cancels the job,
on expiry or otherwise. Cancelling is [JobHandle.cancel](#cancel), and only ever
that.

An expiry is an outcome; a host that stops answering is not. If a poll goes
unanswered past its own deadline this raises `TIMEOUT` rather than reporting
a timeout outcome, because there is no snapshot behind an answer that never
came, and inventing one would be worse than saying so.

#### Parameters

##### options?

[`JobWaitOptions`](JobWaitOptions.md)

#### Returns

`Promise`\<[`JobWaitOutcome`](JobWaitOutcome.md)\>
