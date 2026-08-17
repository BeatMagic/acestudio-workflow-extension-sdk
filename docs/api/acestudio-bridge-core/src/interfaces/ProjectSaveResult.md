# Interface: ProjectSaveResult

Success payload of `project save`.

## Properties

### isNewProject

```ts
isNewProject: boolean;
```

***

### isTempProject

```ts
isTempProject: boolean;
```

***

### projectName

```ts
projectName: string;
```

***

### projectPath

```ts
projectPath: string;
```

***

### savedPath

```ts
savedPath: string;
```

Where the project was actually written. A save wraps the requested path in a project folder, so this is the file to reopen — not necessarily the path that was asked for.
