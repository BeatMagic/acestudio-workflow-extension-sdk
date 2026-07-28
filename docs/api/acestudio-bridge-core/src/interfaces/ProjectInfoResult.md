# Interface: ProjectInfoResult

Success payload of `project info`.

## Properties

### duration

```ts
duration: number;
```

Arrangement length in project ticks.

***

### isNewProject

```ts
isNewProject: boolean;
```

True if the project was just created and has never been saved at all.

***

### isTempProject

```ts
isTempProject: boolean;
```

True if the project has never been saved to a permanent path.

***

### projectName

```ts
projectName: string;
```

Project filename without extension. Empty string for temporary or unsaved projects.
