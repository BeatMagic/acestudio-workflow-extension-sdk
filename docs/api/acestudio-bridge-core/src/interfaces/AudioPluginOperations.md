# Interface: AudioPluginOperations

The `audio-plugin` operations, mirroring the canonical operation tree 1:1.

## Methods

### applyPreset()

```ts
applyPreset(params, options?): Promise<AudioPluginApplyPresetResult>;
```

Apply a library preset to a hosted plugin, replacing its current parameter state.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`AudioPluginApplyPresetParams`](AudioPluginApplyPresetParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginApplyPresetResult`](AudioPluginApplyPresetResult.md)\>

***

### editorCapture()

```ts
editorCapture(params?, options?): Promise<AudioPluginEditorCaptureResult>;
```

Capture the plugin region of an open editor as a PNG image.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginEditorCaptureParams`](AudioPluginEditorCaptureParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorCaptureResult`](AudioPluginEditorCaptureResult.md)\>

***

### editorClick()

```ts
editorClick(params, options?): Promise<AudioPluginEditorClickResult>;
```

Click a point in an open editor's plugin region.

Requires the `audioplugin.control` capability.

#### Parameters

##### params

[`AudioPluginEditorClickParams`](AudioPluginEditorClickParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorClickResult`](AudioPluginEditorClickResult.md)\>

***

### editorClose()

```ts
editorClose(params?, options?): Promise<AudioPluginEditorCloseResult>;
```

Take a plugin's editor off screen: close an external plugin window or collapse a built-in effect.

Requires the `ui.control` capability.

#### Parameters

##### params?

[`AudioPluginEditorCloseParams`](AudioPluginEditorCloseParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorCloseResult`](AudioPluginEditorCloseResult.md)\>

***

### editorDblclick()

```ts
editorDblclick(params, options?): Promise<AudioPluginEditorDblclickResult>;
```

Double-click a point in an open editor's plugin region.

Requires the `audioplugin.control` capability.

#### Parameters

##### params

[`AudioPluginEditorDblclickParams`](AudioPluginEditorDblclickParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorDblclickResult`](AudioPluginEditorDblclickResult.md)\>

***

### editorDrag()

```ts
editorDrag(params, options?): Promise<AudioPluginEditorDragResult>;
```

Drag through an open editor's plugin region along a sequence of waypoints.

Requires the `audioplugin.control` capability.

#### Parameters

##### params

[`AudioPluginEditorDragParams`](AudioPluginEditorDragParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorDragResult`](AudioPluginEditorDragResult.md)\>

***

### editorHover()

```ts
editorHover(params, options?): Promise<AudioPluginEditorHoverResult>;
```

Move the pointer to a point in an open editor without pressing any button.

Requires the `audioplugin.control` capability.

#### Parameters

##### params

[`AudioPluginEditorHoverParams`](AudioPluginEditorHoverParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorHoverResult`](AudioPluginEditorHoverResult.md)\>

***

### editorInfo()

```ts
editorInfo(params?, options?): Promise<AudioPluginEditorInfoResult>;
```

Read a plugin editor's state: kind, open status, size, scale, and resizability.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginEditorInfoParams`](AudioPluginEditorInfoParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorInfoResult`](AudioPluginEditorInfoResult.md)\>

***

### editorKey()

```ts
editorKey(params, options?): Promise<AudioPluginEditorKeyResult>;
```

Press and release a key in an open editor, with optional modifier keys held.

Requires the `audioplugin.control` capability.

#### Parameters

##### params

[`AudioPluginEditorKeyParams`](AudioPluginEditorKeyParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorKeyResult`](AudioPluginEditorKeyResult.md)\>

***

### editorOpen()

```ts
editorOpen(params?, options?): Promise<AudioPluginEditorOpenResult>;
```

Put a plugin's editor on screen: open an external plugin window or expand a built-in effect.

Requires the `ui.control` capability.

#### Parameters

##### params?

[`AudioPluginEditorOpenParams`](AudioPluginEditorOpenParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorOpenResult`](AudioPluginEditorOpenResult.md)\>

***

### editorResize()

```ts
editorResize(params, options?): Promise<AudioPluginEditorResizeResult>;
```

Resize an open editor's plugin region through the plugin's resize protocol.

Requires the `audioplugin.control` capability.

#### Parameters

##### params

[`AudioPluginEditorResizeParams`](AudioPluginEditorResizeParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorResizeResult`](AudioPluginEditorResizeResult.md)\>

***

### editorType()

```ts
editorType(params, options?): Promise<AudioPluginEditorTypeResult>;
```

Type text into an open editor, sent character by character to the focused control.

Requires the `audioplugin.control` capability.

#### Parameters

##### params

[`AudioPluginEditorTypeParams`](AudioPluginEditorTypeParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorTypeResult`](AudioPluginEditorTypeResult.md)\>

***

### editorWheel()

```ts
editorWheel(params, options?): Promise<AudioPluginEditorWheelResult>;
```

Scroll the mouse wheel at a point in an open editor's plugin region.

Requires the `audioplugin.control` capability.

#### Parameters

##### params

[`AudioPluginEditorWheelParams`](AudioPluginEditorWheelParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginEditorWheelResult`](AudioPluginEditorWheelResult.md)\>

***

### exportPreset()

```ts
exportPreset(params?, options?): Promise<AudioPluginExportPresetResult>;
```

Export a hosted plugin's current state as preset file bytes.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginExportPresetParams`](AudioPluginExportPresetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginExportPresetResult`](AudioPluginExportPresetResult.md)\>

***

### findPresets()

```ts
findPresets(params, options?): Promise<AudioPluginFindPresetsResult>;
```

Find presets in a hosted plugin's library by name, in every folder — the grep beside `list-presets`'s `ls`.

Requires the `audioplugin.read` capability.

#### Parameters

##### params

[`AudioPluginFindPresetsParams`](AudioPluginFindPresetsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginFindPresetsResult`](AudioPluginFindPresetsResult.md)\>

***

### getParams()

```ts
getParams(params?, options?): Promise<AudioPluginGetParamsResult>;
```

List one hosted plugin's parameters — id, range, current value and display text — with the token the reserved `fingerprint` argument carries back.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginGetParamsParams`](AudioPluginGetParamsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginGetParamsResult`](AudioPluginGetParamsResult.md)\>

***

### getState()

```ts
getState(params?, options?): Promise<AudioPluginGetStateResult>;
```

Read a hosted plugin's bare state bytes.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginGetStateParams`](AudioPluginGetStateParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginGetStateResult`](AudioPluginGetStateResult.md)\>

***

### importPreset()

```ts
importPreset(params, options?): Promise<AudioPluginImportPresetResult>;
```

Apply a preset file to a hosted plugin from bytes.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`AudioPluginImportPresetParams`](AudioPluginImportPresetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginImportPresetResult`](AudioPluginImportPresetResult.md)\>

***

### listAvailable()

```ts
listAvailable(params?, options?): Promise<AudioPluginListAvailableResult>;
```

List the plugin registry: ACE's built-in effects plus every third-party plugin the last scan found, instruments included.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginListAvailableParams`](AudioPluginListAvailableParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginListAvailableResult`](AudioPluginListAvailableResult.md)\>

***

### listParams()

```ts
listParams(params?, options?): Promise<AudioPluginListParamsResult>;
```

List the names of one hosted plugin's parameters, so a caller can see what is there before reading any of it. `detail` adds each one's shape; values come from `audio-plugin get-params`.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginListParamsParams`](AudioPluginListParamsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginListParamsResult`](AudioPluginListParamsResult.md)\>

***

### listPresets()

```ts
listPresets(params?, options?): Promise<AudioPluginListPresetsResult>;
```

List one folder of a hosted plugin's preset library — the presets in it and the folders under it, the way `ls` would — or, with `recursive`, the whole tree beneath it. Presets bundled with the app sit where the plugin bundles them, marked `factory`.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginListPresetsParams`](AudioPluginListPresetsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginListPresetsResult`](AudioPluginListPresetsResult.md)\>

***

### movePreset()

```ts
movePreset(params, options?): Promise<AudioPluginMovePresetResult>;
```

Move a preset within its plugin's library — into another folder, to a new name, or both — the file manager's `mv`, with the destination folder created on demand. Library state, so it is not undoable. Bundled presets are refused.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`AudioPluginMovePresetParams`](AudioPluginMovePresetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginMovePresetResult`](AudioPluginMovePresetResult.md)\>

***

### removePreset()

```ts
removePreset(params, options?): Promise<AudioPluginRemovePresetResult>;
```

Remove a preset from a plugin's library, sending the file to the system trash, or remove an empty folder.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`AudioPluginRemovePresetParams`](AudioPluginRemovePresetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginRemovePresetResult`](AudioPluginRemovePresetResult.md)\>

***

### savePreset()

```ts
savePreset(params, options?): Promise<AudioPluginSavePresetResult>;
```

Save a hosted plugin's current parameter state to its preset library, at a path, creating the folders on the way. Library state, so it is not undoable.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`AudioPluginSavePresetParams`](AudioPluginSavePresetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginSavePresetResult`](AudioPluginSavePresetResult.md)\>

***

### scan()

```ts
scan(params?, options?): Promise<AudioPluginScanResult>;
```

Scan the system for third-party plugins and update the app's plugin registry — the one registry, effects and instruments alike. Answers with a job id; settle it with `job wait`.

Requires the `audioplugin.write` capability.

#### Parameters

##### params?

[`AudioPluginScanParams`](AudioPluginScanParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginScanResult`](AudioPluginScanResult.md)\>

***

### set()

```ts
set(params?, options?): Promise<AudioPluginSetResult>;
```

Set a hosted plugin's enabled state, bypass, or display name.

Requires the `audioplugin.write` capability.

#### Parameters

##### params?

[`AudioPluginSetParams`](AudioPluginSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginSetResult`](AudioPluginSetResult.md)\>

***

### setParam()

```ts
setParam(params, options?): Promise<AudioPluginSetParamResult>;
```

Set one of a hosted plugin's parameters by its stable id, as a normalized 0..1 `value` or as the `display` text the plugin shows for it.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`AudioPluginSetParamParams`](AudioPluginSetParamParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginSetParamResult`](AudioPluginSetParamResult.md)\>

***

### setState()

```ts
setState(params, options?): Promise<AudioPluginSetStateResult>;
```

Apply bare state bytes to a hosted plugin.

Requires the `audioplugin.write` capability.

#### Parameters

##### params

[`AudioPluginSetStateParams`](AudioPluginSetStateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`AudioPluginSetStateResult`](AudioPluginSetStateResult.md)\>

***

### slots()

```ts
slots(params?, options?): Promise<AudioPluginSlotsResult>;
```

List every place an audio plugin sits on one track: the chain's inserts in order, plus the instrument slot — mounted or empty — where the track has one.

Requires the `audioplugin.read` capability.

#### Parameters

##### params?

[`AudioPluginSlotsParams`](AudioPluginSlotsParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`AudioPluginSlotsResult`](AudioPluginSlotsResult.md)\>
