# Interface: ProjectOperations

The `project` operations, mirroring the canonical operation tree 1:1.

## Methods

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
