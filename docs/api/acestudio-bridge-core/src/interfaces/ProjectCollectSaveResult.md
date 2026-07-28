# Interface: ProjectCollectSaveResult

Success payload of `project collect-save`.

## Properties

### collected

```ts
collected: "copied" | "noNeed";
```

`copied` = external media was pulled into the bundle; `noNeed` = every referenced file already lived inside it.

***

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

***

### savedPath

```ts
savedPath: string;
```

Where the project was actually written. A save wraps the requested path in a project folder, so this is the file to reopen -- not necessarily the path that was asked for.
