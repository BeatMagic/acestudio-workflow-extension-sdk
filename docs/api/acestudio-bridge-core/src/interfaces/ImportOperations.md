# Interface: ImportOperations

The `import` operations, mirroring the canonical operation tree 1:1.

## Methods

### file()

```ts
file(params, options?): Promise<ImportFileResult>;
```

Import a media or project file, placed and trimmed as asked.

Requires the `import.invoke` capability.

#### Parameters

##### params

[`ImportFileParams`](ImportFileParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ImportFileResult`](ImportFileResult.md)\>
