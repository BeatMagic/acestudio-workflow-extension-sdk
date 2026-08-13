# Interface: ProjectOperations

The `project` operations, mirroring the canonical operation tree 1:1, and the subscription that reports when the subject changes.

## Methods

### collectSave()

```ts
collectSave(params?, options?): Promise<ProjectCollectSaveResult>;
```

Copy externally-referenced media into the bundle, then save.

Requires the `project.lifecycle` capability.

#### Parameters

##### params?

[`ProjectCollectSaveParams`](ProjectCollectSaveParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ProjectCollectSaveResult`](ProjectCollectSaveResult.md)\>

***

### dirty()

```ts
dirty(options?): Promise<ProjectDirtyResult>;
```

Report whether the project has unsaved changes.

Requires the `project.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ProjectDirtyResult`](ProjectDirtyResult.md)\>

***

### info()

```ts
info(options?): Promise<ProjectInfoResult>;
```

Read basic project metadata: name, saved/temp state, and arrangement length.

Requires the `project.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ProjectInfoResult`](ProjectInfoResult.md)\>

***

### new()

```ts
new(params?, options?): Promise<ProjectNewResult>;
```

Reset to a fresh project, optionally from a song template.

Requires the `project.lifecycle` capability.

#### Parameters

##### params?

[`ProjectNewParams`](ProjectNewParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ProjectNewResult`](ProjectNewResult.md)\>

***

### onChanged()

```ts
onChanged(listener): Unsubscribe;
```

The open project changed identity or location: opened, closed, or its session
folder relocated within the same session (Save-As / temp promotion, never a
project switch — ADR 0026/0027). A peer re-fetches with `project info`.

Listen for changes on the `project` channel. The event is a hint to re-read, not the new state.

Requires the `project.read` capability — an ungranted subscription is refused at this call, not silently never delivered.

#### Parameters

##### listener

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### open()

```ts
open(params, options?): Promise<ProjectOpenResult>;
```

Open a project file, blocking until it is fully loaded.

Requires the `project.lifecycle` capability.

#### Parameters

##### params

[`ProjectOpenParams`](ProjectOpenParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ProjectOpenResult`](ProjectOpenResult.md)\>

***

### recent()

```ts
recent(options?): Promise<ProjectRecentResult>;
```

List recently opened projects, most recently read first.

Requires the `project.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ProjectRecentResult`](ProjectRecentResult.md)\>

***

### recentClear()

```ts
recentClear(options?): Promise<void>;
```

Clear the recently-opened-projects history.

Requires the `project.lifecycle` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### save()

```ts
save(options?): Promise<ProjectSaveResult>;
```

Save the project to its current path.

Requires the `project.lifecycle` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ProjectSaveResult`](ProjectSaveResult.md)\>

***

### saveAs()

```ts
saveAs(params, options?): Promise<ProjectSaveAsResult>;
```

Save the project to a new path and continue working there.

Requires the `project.lifecycle` capability.

#### Parameters

##### params

[`ProjectSaveAsParams`](ProjectSaveAsParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ProjectSaveAsResult`](ProjectSaveAsResult.md)\>

***

### synthesisStatus()

```ts
synthesisStatus(options?): Promise<ProjectSynthesisStatusResult>;
```

Read whether content synthesis is currently in progress.

Requires the `project.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ProjectSynthesisStatusResult`](ProjectSynthesisStatusResult.md)\>
