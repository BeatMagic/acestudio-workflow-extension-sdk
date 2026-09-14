# Interface: TempoOperations

The `tempo` operations, mirroring the canonical operation tree 1:1, and the subscription that reports when the subject changes.

## Methods

### analyze()

```ts
analyze(params?, options?): Promise<TempoAnalyzeResult>;
```

Start beat/tempo analysis of an audio clip or an audio file. Returns a job id immediately; observe it with the job group. Read the finished analysis by id with `tempo get-analysis`.

Requires the `tempo.analyze` capability.

#### Parameters

##### params?

[`TempoAnalyzeParams`](TempoAnalyzeParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TempoAnalyzeResult`](TempoAnalyzeResult.md)\>

***

### applyBeatAnalysis()

```ts
applyBeatAnalysis(params, options?): Promise<TempoApplyBeatAnalysisResult>;
```

EXPERIMENTAL (alpha). Apply an analyzed grid song-anchored: replace tempo and time signatures, and move content to keep its seconds. Provided as is.

Requires the `tempo.applyV2` capability.

#### Parameters

##### params

[`TempoApplyBeatAnalysisParams`](TempoApplyBeatAnalysisParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TempoApplyBeatAnalysisResult`](TempoApplyBeatAnalysisResult.md)\>

***

### get()

```ts
get(options?): Promise<TempoGetResult>;
```

Read the full tempo automation table (all BPM points).

Requires the `tempo.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TempoGetResult`](TempoGetResult.md)\>

***

### getAnalysis()

```ts
getAnalysis(params, options?): Promise<TempoGetAnalysisResult>;
```

Read a filed beat analysis by the id `tempo analyze` reported: its beats, downbeats, tempo and meter. Reading never consumes it, so the answer survives an apply and can be fetched at any time by anyone holding the id.

Requires the `tempo.read` capability.

#### Parameters

##### params

[`TempoGetAnalysisParams`](TempoGetAnalysisParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TempoGetAnalysisResult`](TempoGetAnalysisResult.md)\>

***

### onChanged()

```ts
onChanged(listener): Unsubscribe;
```

The tempo curve changed — a point added, moved, bent, or removed, or the whole
curve replaced by a beat-analysis apply. A peer re-fetches with `tempo get`
for the single-tempo view or `tempo points` for the curve.

Listen for `tempo.changed`. The event is a hint to re-read, not the new state.

Requires the `tempo.read` capability — an ungranted subscription is refused at this call, not silently never delivered.

#### Parameters

##### listener

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### points()

```ts
points(options?): Promise<TempoPointsResult>;
```

List the tempo curve's points in both units, with the fingerprint the point writes take as --if-match.

Requires the `tempo.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TempoPointsResult`](TempoPointsResult.md)\>

***

### removePoint()

```ts
removePoint(params, options?): Promise<TempoRemovePointResult>;
```

Remove the tempo point at a position.

Requires the `tempo.write` capability.

#### Parameters

##### params

[`TempoRemovePointParams`](TempoRemovePointParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`TempoRemovePointResult`](TempoRemovePointResult.md)\>

***

### set()

```ts
set(params, options?): Promise<void>;
```

Replace the entire tempo automation table with a new list of points.

Requires the `tempo.write` capability.

#### Parameters

##### params

[`TempoSetParams`](TempoSetParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### setDisplayRange()

```ts
setDisplayRange(params?, options?): Promise<TempoSetDisplayRangeResult>;
```

Set the BPM range the tempo curve editor draws (project-persisted, not a view preference).

Requires the `tempo.write` capability.

#### Parameters

##### params?

[`TempoSetDisplayRangeParams`](TempoSetDisplayRangeParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`TempoSetDisplayRangeResult`](TempoSetDisplayRangeResult.md)\>

***

### setPoint()

```ts
setPoint(params, options?): Promise<TempoSetPointResult>;
```

Add or replace one tempo point at a position (upsert). Leaves every other point untouched.

Requires the `tempo.write` capability.

#### Parameters

##### params

[`TempoSetPointParams`](TempoSetPointParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`TempoSetPointResult`](TempoSetPointResult.md)\>
