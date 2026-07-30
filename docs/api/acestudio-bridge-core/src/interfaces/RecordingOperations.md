# Interface: RecordingOperations

The `recording` operations, mirroring the canonical operation tree 1:1.

## Methods

### start()

```ts
start(options?): Promise<RecordingStartResult>;
```

Start recording the armed track (the caret's track).

Requires the `recording.control` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`RecordingStartResult`](RecordingStartResult.md)\>

***

### stop()

```ts
stop(options?): Promise<RecordingStopResult>;
```

Stop recording and land the take as one attributed undo entry.

Requires the `recording.control` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`RecordingStopResult`](RecordingStopResult.md)\>
