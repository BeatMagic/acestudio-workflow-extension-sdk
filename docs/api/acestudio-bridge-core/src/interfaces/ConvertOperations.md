# Interface: ConvertOperations

The `convert` operations, mirroring the canonical operation tree 1:1.

## Methods

### editorToGlobal()

```ts
editorToGlobal(params, options?): Promise<ConvertEditorToGlobalResult>;
```

Convert an editor-local tick to a global project tick (adds clip offset). Requires an active pattern editor.

Ungated: a pure function, callable without any capability.

#### Parameters

##### params

[`ConvertEditorToGlobalParams`](ConvertEditorToGlobalParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ConvertEditorToGlobalResult`](ConvertEditorToGlobalResult.md)\>

***

### globalToEditor()

```ts
globalToEditor(params, options?): Promise<ConvertGlobalToEditorResult>;
```

Convert a global project tick to an editor-local tick (subtracts clip offset). Requires an active pattern editor.

Ungated: a pure function, callable without any capability.

#### Parameters

##### params

[`ConvertGlobalToEditorParams`](ConvertGlobalToEditorParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ConvertGlobalToEditorResult`](ConvertGlobalToEditorResult.md)\>

***

### measureToTick()

```ts
measureToTick(params, options?): Promise<ConvertMeasureToTickResult>;
```

Convert a measure/beat position to project ticks, accounting for time-signature changes.

Ungated: a pure function, callable without any capability.

#### Parameters

##### params

[`ConvertMeasureToTickParams`](ConvertMeasureToTickParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ConvertMeasureToTickResult`](ConvertMeasureToTickResult.md)\>

***

### tickToMeasure()

```ts
tickToMeasure(params, options?): Promise<ConvertTickToMeasureResult>;
```

Convert ticks to a musical measure/beat position, accounting for time-signature changes.

Ungated: a pure function, callable without any capability.

#### Parameters

##### params

[`ConvertTickToMeasureParams`](ConvertTickToMeasureParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ConvertTickToMeasureResult`](ConvertTickToMeasureResult.md)\>

***

### tickToTime()

```ts
tickToTime(params, options?): Promise<ConvertTickToTimeResult>;
```

Convert a tick position to seconds, accounting for tempo automation.

Ungated: a pure function, callable without any capability.

#### Parameters

##### params

[`ConvertTickToTimeParams`](ConvertTickToTimeParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ConvertTickToTimeResult`](ConvertTickToTimeResult.md)\>

***

### timeToTick()

```ts
timeToTick(params, options?): Promise<ConvertTimeToTickResult>;
```

Convert a time position (seconds) to project ticks, accounting for tempo automation.

Ungated: a pure function, callable without any capability.

#### Parameters

##### params

[`ConvertTimeToTickParams`](ConvertTimeToTickParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ConvertTimeToTickResult`](ConvertTimeToTickResult.md)\>
