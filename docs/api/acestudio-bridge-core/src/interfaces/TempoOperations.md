# Interface: TempoOperations

The `tempo` operations, mirroring the canonical operation tree 1:1.

## Methods

### analyze()

```ts
analyze(params, options?): Promise<TempoAnalyzeResult>;
```

Start beat/tempo analysis of an audio clip. Returns a job id immediately; observe it with the job group.

Requires the `tempo.analyze` capability.

#### Parameters

##### params

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
setDisplayRange(params, options?): Promise<TempoSetDisplayRangeResult>;
```

Set the BPM range the tempo curve editor draws (project-persisted, not a view preference).

Requires the `tempo.write` capability.

#### Parameters

##### params

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
