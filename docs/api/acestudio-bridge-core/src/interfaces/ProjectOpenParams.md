# Interface: ProjectOpenParams

Arguments for `project open`.

## Properties

### discardChanges?

```ts
optional discardChanges?: boolean;
```

Proceed even if the current project has unsaved changes, discarding them. Without this, a dirty project fails `UNSAVED_CHANGES`.

***

### path

```ts
path: string;
```

Path to the .acep project file to open.
