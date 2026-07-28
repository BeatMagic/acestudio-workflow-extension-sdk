# Interface: ProjectOperations

The `project` operations, mirroring the canonical operation tree 1:1.

## Constructors

### Constructor

```ts
new ProjectOperations(params, options?): Promise<ProjectNewResult>;
```

Reset to a fresh project, optionally from a song template.

Requires the `project.lifecycle` capability.

#### Parameters

##### params

[`ProjectNewParams`](ProjectNewParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ProjectNewResult`](ProjectNewResult.md)\>

## Methods

### collectSave()

```ts
collectSave(params, options?): Promise<ProjectCollectSaveResult>;
```

Copy externally-referenced media into the bundle, then save.

Requires the `project.lifecycle` capability.

#### Parameters

##### params

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

### saveTemplate()

```ts
saveTemplate(params, options?): Promise<ProjectSaveTemplateResult>;
```

Export the project as a reusable song template (.acet).

Requires the `project.lifecycle` capability.

Pay-gated on `membership`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`ProjectSaveTemplateParams`](ProjectSaveTemplateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ProjectSaveTemplateResult`](ProjectSaveTemplateResult.md)\>

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
