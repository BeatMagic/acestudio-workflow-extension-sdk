# Interface: ProjectOpenResult

Success payload of `project open`.

## Properties

### isNewProject

```ts
isNewProject: boolean;
```

True for a just-created project that has never been saved.

***

### isTempProject

```ts
isTempProject: boolean;
```

True while the project lives in the temporary workspace rather than a saved bundle.

***

### projectName

```ts
projectName: string;
```

Project filename without extension. Empty for a temporary or never-saved project.

***

### projectPath

```ts
projectPath: string;
```

Absolute path of the project file. Empty for a temporary project.
